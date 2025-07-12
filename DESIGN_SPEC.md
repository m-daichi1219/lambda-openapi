# Lambda OpenAPI Generator - 設計書

## 1. プロジェクト概要

### 1.1 目的

AWS Lambda + API Gateway で構築された WebAPI から、TypeScript アノテーションを利用して OpenAPI 3.0 ドキュメントを自動生成する NPM ライブラリを開発する。

### 1.2 解決する課題

- API Gateway の定義からでは Lambda 側のパラメータが正確に反映されない
- tsoa は Express 前提で Lambda 特化ではない
- 手動での OpenAPI 仕様書作成・保守コストが高い

### 1.3 ターゲットユーザー

- AWS CDK + TypeScript + Lambda でサーバーレス開発を行う開発者
- OpenAPI ドキュメントの自動化を求めるチーム

## 2. アーキテクチャ設計

### 2.1 全体構成

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Lambda Handler │───▶│  Code Analyzer  │───▶│ OpenAPI Schema  │
│  + Annotations  │    │  (TS Compiler)  │    │   Generator     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │ openapi.json/yml│
                                               └─────────────────┘
```

### 2.2 主要コンポーネント

#### 2.2.1 Annotation Layer

- デコレータベースの API 定義
- 型安全性の確保
- Lambda 特化の属性サポート

#### 2.2.2 Code Analyzer

- TypeScript Compiler API を利用
- デコレータ情報の抽出
- 型情報の解析

#### 2.2.3 Schema Generator

- OpenAPI 3.0 準拠のスキーマ生成
- Lambda 固有の拡張サポート
- 複数出力フォーマット対応

## 3. API 設計

### 3.1 デコレータ仕様

#### 3.1.1 @ApiOperation

```typescript
@ApiOperation({
  summary: string;
  description?: string;
  tags?: string[];
  operationId?: string;
})
```

#### 3.1.2 @ApiResponse

```typescript
@ApiResponse({
  status: number;
  description?: string;
  type?: any;
  example?: any;
  headers?: Record<string, any>;
})
```

#### 3.1.3 @ApiParam / @ApiQuery / @ApiBody

```typescript
@ApiParam({
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
  example?: any;
})

@ApiQuery({
  name: string;
  description?: string;
  required?: boolean;
  type?: any;
  example?: any;
})

@ApiBody({
  description?: string;
  type?: any;
  example?: any;
  required?: boolean;
})
```

#### 3.1.4 @ApiSecurity

```typescript
@ApiSecurity({
  type: 'apiKey' | 'http' | 'oauth2';
  name?: string;
  in?: 'header' | 'query' | 'cookie';
  scheme?: string;
})
```

### 3.2 使用例

```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiSecurity
} from 'lambda-openapi-generator';

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

@ApiOperation({
  summary: 'ユーザー情報取得',
  description: 'IDを指定してユーザー情報を取得する',
  tags: ['users']
})
@ApiSecurity({ type: 'apiKey', name: 'x-api-key', in: 'header' })
@ApiParam({ name: 'userId', description: 'ユーザーID', required: true, type: 'string' })
@ApiQuery({ name: 'include', description: '含める追加情報', required: false, type: 'string' })
@ApiResponse({ status: 200, description: '成功', type: User })
@ApiResponse({ status: 404, description: 'ユーザーが見つかりません' })
export const getUserHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.pathParameters?.userId;
  const include = event.queryStringParameters?.include;

  // 実装
  return {
    statusCode: 200,
    body: JSON.stringify({ id: userId, name: 'John Doe', email: 'john@example.com' })
  };
};

@ApiOperation({
  summary: 'ユーザー作成',
  tags: ['users']
})
@ApiBody({ description: 'ユーザー作成情報', type: CreateUserRequest, required: true })
@ApiResponse({ status: 201, description: '作成成功', type: User })
@ApiResponse({ status: 400, description: 'バリデーションエラー' })
export const createUserHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body: CreateUserRequest = JSON.parse(event.body || '{}');

  // 実装
  return {
    statusCode: 201,
    body: JSON.stringify({ id: '1', ...body })
  };
};
```

## 4. 技術仕様

### 4.1 依存関係

```json
{
  "dependencies": {
    "typescript": "^5.0.0",
    "@types/aws-lambda": "^8.10.0",
    "reflect-metadata": "^0.1.13"
  },
  "peerDependencies": {
    "typescript": ">=4.5.0"
  }
}
```

### 4.2 TypeScript 設定要件

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2020",
    "moduleResolution": "node"
  }
}
```

### 4.3 CLI インターフェース

```bash
# 基本使用
lambda-openapi generate --input ./src/handlers --output ./openapi.json

# オプション付き
lambda-openapi generate \
  --input ./src/handlers \
  --output ./docs/openapi.yml \
  --format yaml \
  --title "My API" \
  --version "1.0.0" \
  --base-path "/api/v1"
```

### 4.4 プログラマティック API

```typescript
import { generateOpenApiSpec } from "lambda-openapi-generator";

const spec = await generateOpenApiSpec({
  inputPaths: ["./src/handlers"],
  title: "My API",
  version: "1.0.0",
  basePath: "/api/v1",
  output: {
    format: "json", // 'json' | 'yaml'
    filePath: "./openapi.json",
  },
});
```

## 5. 実装計画

### 5.1 フェーズ 1: コア機能（4 週間）

- [ ] デコレータ定義とメタデータシステム
- [ ] TypeScript Compiler API 統合
- [ ] 基本的な OpenAPI スキーマ生成
- [ ] CLI 基本機能

### 5.2 フェーズ 2: 高度な機能（3 週間）

- [ ] 複雑な型推論（Generic、Union 型など）
- [ ] CDK 統合サポート
- [ ] バリデーション機能
- [ ] テストカバレッジ 95%以上

### 5.3 フェーズ 3: エコシステム連携（2 週間）

- [ ] Swagger UI 統合
- [ ] API ドキュメントサイト生成
- [ ] CI/CD 統合例
- [ ] パフォーマンス最適化

## 6. 品質・制約事項

### 6.1 パフォーマンス目標

- 100 ハンドラーの解析時間: 5 秒以内
- メモリ使用量: 512MB 以内
- 生成されるスキーマサイズ: 元コードの 10%以内

### 6.2 サポート範囲

- **対応バージョン**

  - TypeScript: 4.5+
  - Node.js: 16+
  - AWS Lambda Runtime: nodejs16.x, nodejs18.x, nodejs20.x

- **制限事項**
  - Dynamic import 未対応
  - 複雑な Generic 型の一部制限
  - 循環参照型の制限

### 6.3 セキュリティ考慮事項

- 機密情報の自動除外
- セキュリティスキーマの適切な定義
- 生成されるドキュメントの検証

## 7. 配布・保守戦略

### 7.1 NPM パッケージ戦略

- パッケージ名: `lambda-openapi-generator`
- セマンティックバージョニング
- TypeScript 型定義の同梱
- ESM/CommonJS 両対応

### 7.2 ドキュメント

- README による基本使用方法
- 公式ドキュメントサイト
- 実践的なサンプル集
- マイグレーションガイド

### 7.3 継続的改善

- ユーザーフィードバック収集
- 月次アップデート
- セキュリティ脆弱性対応
- AWS 新機能への迅速な対応

## 8. 成功指標

### 8.1 技術指標

- ビルド成功率: 95%以上
- テストカバレッジ: 90%以上
- ドキュメント生成成功率: 98%以上

### 8.2 ユーザー指標

- 月間ダウンロード数: 1000+
- GitHub Stars: 100+
- Issue 解決時間: 平均 3 日以内

---

この設計書は開発プロセスで継続的に更新・改善していきます。
