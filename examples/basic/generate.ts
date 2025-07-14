import { generateOpenApiSpec } from '../../lib/generator/openapi-generator';
import { getUserHandler } from './handlers/getUserHandler';
import * as fs from 'fs';

const config = {
  inputPaths: ['./handlers'],
  info: {
    title: 'User API',
    version: '1.0.0',
    description: 'Example API generated with lambda-openapi',
  },
  servers: [
    {
      url: 'https://api.example.com',
      description: 'Production server',
    },
  ],
};

// Generate OpenAPI specification
const spec = generateOpenApiSpec(config, [getUserHandler]);

// Save to file
fs.writeFileSync('./openapi.json', JSON.stringify(spec, null, 2));

console.log('✅ OpenAPI specification generated successfully!');
console.log('📄 Saved to: ./openapi.json');
console.log('\n📋 Generated specification:');
console.log(JSON.stringify(spec, null, 2));
