/* eslint-disable prettier/prettier */
import { INestApplication } from '@nestjs/common';
import { OpenAPIObject, DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './swagger.config';

/**
 * 
 * @param app accepts data of type INestApplication
 * @returns an OpenAPIObject object
 */
export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    // .addBasicAuth(
    //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    //   'access-token',
    // )
    .setVersion(SWAGGER_CONFIG.version)
     .addBearerAuth();

    for(const tag of SWAGGER_CONFIG.tags){
        builder.addTag(tag);
    }
    const options=builder.build();
    return SwaggerModule.createDocument(app,options);
}
