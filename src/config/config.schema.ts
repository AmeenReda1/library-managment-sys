import * as Joi from "joi";




export interface IEnv {
    PORT: number;
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    DATABASE_HOST: string;
    DATABASE_PORT: number;
    JWT_SECRET: string;
    PAGINATION_DEFAULT_LIMIT: number;
    PAGINATION_MAX_LIMIT: number;
}

export const configValidationSchema = Joi.object<IEnv>({

    PORT: Joi.number().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_USER: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required(),
    PAGINATION_DEFAULT_LIMIT: Joi.number().default(10),
    PAGINATION_MAX_LIMIT: Joi.number().default(100),
});


export const AppConfig: IEnv = {

    PORT: Number(process.env.PORT),
    DATABASE_NAME: process.env.DATABASE_NAME as string,
    DATABASE_USER: process.env.DATABASE_USER as string,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD as string,
    DATABASE_HOST: process.env.DATABASE_HOST as string,
    DATABASE_PORT: Number(process.env.DATABASE_PORT),
    JWT_SECRET: process.env.JWT_SECRET as string,
    PAGINATION_DEFAULT_LIMIT: Number(process.env.PAGINATION_DEFAULT_LIMIT) || 10,
    PAGINATION_MAX_LIMIT: Number(process.env.PAGINATION_MAX_LIMIT) || 100,
}
console.log(AppConfig);
