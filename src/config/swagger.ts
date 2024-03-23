import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path"; // Import path module
import fs from "fs";
import YAML from 'yaml';

const swaggerYamlDocPath = path.join(__dirname, "../docs/swagger.yaml");
const file  = fs.readFileSync(swaggerYamlDocPath, 'utf8');
const swaggerDocument = YAML.parse(file)

export const setupSwagger = (app: {
  use: (
    arg0: string,
    arg1: RequestHandler<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >[],
    arg2: RequestHandler<
      ParamsDictionary,
      any,
      any,
      ParsedQs,
      Record<string, any>
    >
  ) => void;
}) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger Initialized Successfully");
};
