import 'reflect-metadata';
import {
  METADATA_KEYS,
  ApiOperationMetadata,
  ApiResponseMetadata,
  ApiParamMetadata,
  ApiQueryMetadata,
  ApiBodyMetadata,
  ApiSecurityMetadata,
  ApiTagMetadata,
  HandlerMetadata,
} from '../types/internal';

/**
 * Utility functions for managing metadata storage and retrieval
 */
export class MetadataManager {
  /**
   * Store API operation metadata
   */
  static setOperation(target: any, metadata: ApiOperationMetadata): void {
    Reflect.defineMetadata(METADATA_KEYS.API_OPERATION, metadata, target);
  }

  /**
   * Get API operation metadata
   */
  static getOperation(target: any): ApiOperationMetadata | undefined {
    return Reflect.getMetadata(METADATA_KEYS.API_OPERATION, target);
  }

  /**
   * Add API response metadata
   */
  static addResponse(target: any, metadata: ApiResponseMetadata): void {
    const existing = this.getResponses(target);
    const updated = [...existing, metadata].sort((a, b) => a.order - b.order);
    Reflect.defineMetadata(METADATA_KEYS.API_RESPONSES, updated, target);
  }

  /**
   * Get all API response metadata
   */
  static getResponses(target: any): ApiResponseMetadata[] {
    return Reflect.getMetadata(METADATA_KEYS.API_RESPONSES, target) || [];
  }

  /**
   * Add API parameter metadata
   */
  static addParam(target: any, metadata: ApiParamMetadata): void {
    const existing = this.getParams(target);
    const updated = [...existing, metadata].sort((a, b) => a.order - b.order);
    Reflect.defineMetadata(METADATA_KEYS.API_PARAMS, updated, target);
  }

  /**
   * Get all API parameter metadata
   */
  static getParams(target: any): ApiParamMetadata[] {
    return Reflect.getMetadata(METADATA_KEYS.API_PARAMS, target) || [];
  }

  /**
   * Add API query parameter metadata
   */
  static addQuery(target: any, metadata: ApiQueryMetadata): void {
    const existing = this.getQueries(target);
    const updated = [...existing, metadata].sort((a, b) => a.order - b.order);
    Reflect.defineMetadata(METADATA_KEYS.API_QUERIES, updated, target);
  }

  /**
   * Get all API query parameter metadata
   */
  static getQueries(target: any): ApiQueryMetadata[] {
    return Reflect.getMetadata(METADATA_KEYS.API_QUERIES, target) || [];
  }

  /**
   * Set API body metadata
   */
  static setBody(target: any, metadata: ApiBodyMetadata): void {
    Reflect.defineMetadata(METADATA_KEYS.API_BODY, metadata, target);
  }

  /**
   * Get API body metadata
   */
  static getBody(target: any): ApiBodyMetadata | undefined {
    return Reflect.getMetadata(METADATA_KEYS.API_BODY, target);
  }

  /**
   * Add API security metadata
   */
  static addSecurity(target: any, metadata: ApiSecurityMetadata): void {
    const existing = this.getSecurity(target);
    const updated = [...existing, metadata].sort((a, b) => a.order - b.order);
    Reflect.defineMetadata(METADATA_KEYS.API_SECURITY, updated, target);
  }

  /**
   * Get all API security metadata
   */
  static getSecurity(target: any): ApiSecurityMetadata[] {
    return Reflect.getMetadata(METADATA_KEYS.API_SECURITY, target) || [];
  }

  /**
   * Add API tag metadata
   */
  static addTag(target: any, metadata: ApiTagMetadata): void {
    const existing = this.getTags(target);
    const updated = [...existing, metadata].sort((a, b) => a.order - b.order);
    Reflect.defineMetadata(METADATA_KEYS.API_TAGS, updated, target);
  }

  /**
   * Get all API tag metadata
   */
  static getTags(target: any): ApiTagMetadata[] {
    return Reflect.getMetadata(METADATA_KEYS.API_TAGS, target) || [];
  }

  /**
   * Get complete handler metadata
   */
  static getHandlerMetadata(target: any): HandlerMetadata {
    return {
      operation: this.getOperation(target),
      responses: this.getResponses(target),
      params: this.getParams(target),
      queries: this.getQueries(target),
      body: this.getBody(target),
      security: this.getSecurity(target),
      tags: this.getTags(target),
    };
  }

  /**
   * Check if target has any API metadata
   */
  static hasMetadata(target: any): boolean {
    return (
      this.getOperation(target) !== undefined ||
      this.getResponses(target).length > 0 ||
      this.getParams(target).length > 0 ||
      this.getQueries(target).length > 0 ||
      this.getBody(target) !== undefined ||
      this.getSecurity(target).length > 0 ||
      this.getTags(target).length > 0
    );
  }

  /**
   * Clear all metadata from target
   */
  static clearMetadata(target: any): void {
    Reflect.deleteMetadata(METADATA_KEYS.API_OPERATION, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_RESPONSES, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_PARAMS, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_QUERIES, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_BODY, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_SECURITY, target);
    Reflect.deleteMetadata(METADATA_KEYS.API_TAGS, target);
  }

  /**
   * Get metadata keys that exist on target
   */
  static getExistingMetadataKeys(target: any): string[] {
    const keys: string[] = [];

    if (this.getOperation(target)) keys.push(METADATA_KEYS.API_OPERATION);
    if (this.getResponses(target).length > 0)
      keys.push(METADATA_KEYS.API_RESPONSES);
    if (this.getParams(target).length > 0) keys.push(METADATA_KEYS.API_PARAMS);
    if (this.getQueries(target).length > 0)
      keys.push(METADATA_KEYS.API_QUERIES);
    if (this.getBody(target)) keys.push(METADATA_KEYS.API_BODY);
    if (this.getSecurity(target).length > 0)
      keys.push(METADATA_KEYS.API_SECURITY);
    if (this.getTags(target).length > 0) keys.push(METADATA_KEYS.API_TAGS);

    return keys;
  }
}
