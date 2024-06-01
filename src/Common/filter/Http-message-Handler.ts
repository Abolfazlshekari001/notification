import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { compilerLogger, infoLogger } from 'src/Configs/winston/winston.config';
import {
  Unauthorized,
  Double_comment,
  TheDataHasAlreadyBeenDeleted,
  DataNotFound,
  Data_Field_Is_Duplicate,
  forbiddenResource,
  Bad_Request_Exception,
  Total_Resend_Code,
  NoContent,
  Invalid_Input,
  DataNotFound2,
  PageNotFound,
  InternalServerError,
  Token_Is_Subescribed,
  Token_Is_UnSubescribed,
  Token_Already_Exists,
} from '../translate/Error.Translate';
import {
  Request_Was_Successful,
  Request_Was_Successful2,
  Request_Was_Successful1,
  Request_Was_Successful3,
  Request_Was_Successful4,
} from '../translate/Successful.Translate';
import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const generalError = exception.getResponse();
    let language = request.headers['language'] as string;
    if (!language) {
      language = 'en';
    }
    let result: any;
    let message: string;
    switch (true) {
      case generalError.response !== undefined:
        result = {
          status_code: generalError.response.status_code,
          error_code: generalError.response.code,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
        message = generalError.response.message[language];
        break;

      case exception.status === 401:
        const messagedev =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format1 = Unauthorized(messagedev['fa'], messagedev['en']);
        result = {
          success: false,
          status_code: format1.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev,
        };
        message = format1.message[language];
        break;

      case exception.status === 401:
        result = {
          status_code: Double_comment.status_code,
          error_code: Double_comment.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Double_comment.message[language];
        break;

      case exception.status === 405:
        result = {
          status_code: TheDataHasAlreadyBeenDeleted.status_code,
          error_code: TheDataHasAlreadyBeenDeleted.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = TheDataHasAlreadyBeenDeleted.message[language];
        break;
      case exception.status === 422:
        result = {
          status_code: Token_Is_Subescribed.status_code,
          error_code: Token_Is_Subescribed.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Token_Is_Subescribed.message[language];
        break;
      case exception.status === 422 && exception.message === 'The token has already been unSubscribed to this thread':
        result = {
          status_code: Token_Is_UnSubescribed.status_code,
          error_code: Token_Is_UnSubescribed.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Token_Is_UnSubescribed.message[language];
        break;

      case exception.status === 409:
        result = {
          status_code: Token_Already_Exists.status_code,
          error_code: Token_Already_Exists.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Token_Already_Exists.message[language];
        break;
      case generalError.statusCode === 409:
        const messagedev1 =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format8 = DataNotFound(messagedev1['fa'], messagedev1['en']);
        result = {
          success: false,
          status_code: format8.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev1,
        };
        message = format8.message[language];
        break;

      case exception.status === 200:
        result = {
          status_code: Data_Field_Is_Duplicate.status_code,
          error_code: Data_Field_Is_Duplicate.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Data_Field_Is_Duplicate.message[language];
        break;

      case exception.status === 403:
        result = {
          status_code: forbiddenResource.status_code,
          error_code: forbiddenResource.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = forbiddenResource.message[language];
        break;

      case exception.status === 400:
        const messagedev2 =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format0 = Bad_Request_Exception(
          messagedev2['fa'],
          messagedev2['en'],
        );
        result = {
          success: false,
          status_code: format0.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev2,
        };
        message = format0.message[language];
        break;

      case exception.status === 429:
        result = {
          status_code: Total_Resend_Code.status_code,
          error_code: Total_Resend_Code.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Total_Resend_Code.message[language];
        break;

      case exception.status === 409:
        const messagedev4 =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format11 = NoContent(messagedev4['fa'], messagedev4['en']);
        result = {
          success: false,
          status_code: format11.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev4,
        };
        message = format11.message[language];
        break;

      case exception.status === 422:
        result = {
          status_code: Invalid_Input.status_code,
          error_code: Invalid_Input.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Invalid_Input.message[language];
        break;

      case exception.status === 201:
        result = {
          success: true,
          status_code: Request_Was_Successful.status_code,
          error_code: Request_Was_Successful.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Request_Was_Successful.message[language];
        break;

      case exception.status === 201:
        result = {
          success: true,
          status_code: Request_Was_Successful2.status_code,
          error_code: Request_Was_Successful2.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Request_Was_Successful2.message[language];
        break;

      case exception.status === 201:
        const format2 = Request_Was_Successful1(exception.additional_info);
        result = {
          success: true,
          status_code: format2.status_code,
          error_code: format2.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Request_Was_Successful.message[language];
        break;
      case exception.status === 201:
        const format4 = Request_Was_Successful3(exception.additional_info);
        result = {
          success: true,
          status_code: format4.status_code,
          error_code: format4.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = Request_Was_Successful.message[language];
        break;

      case exception.status === 201:
        const messagedev3 =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format5 = Request_Was_Successful4(
          messagedev3['fa'],
          messagedev3['en'],
        );
        result = {
          success: false,
          status_code: format5.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev3,
        };
        message = format5.message[language];
        break;
      case exception.status === 410:
        result = {
          success: false,
          status_code: DataNotFound2.status_code,
          error_code: DataNotFound2.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = DataNotFound2.message[language];
        break;

      case exception.status === 404:
        const messagedev409 =
          exception.getResponse().message !== undefined
            ? exception.getResponse().message
            : exception.getResponse().message_developer;
        const format404 = PageNotFound(
          messagedev409['fa'] ? messagedev409['fa'] : '',
          messagedev409['en']
            ? messagedev409['en']
            : exception.getResponse().message,
        );
        result = {
          success: false,
          status_code: format404.status_code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: messagedev409,
        };
        message = format404.message[language];
        break;
      case exception.status === 500:
        const format = InternalServerError(exception.message);
        result = {
          success: false,
          status_code: format.status_code,
          error_code: format.code,
          timestamp: new Date().toISOString(),
          path: request.url,
          message_developer: exception.getResponse().message,
        };
        message = format.message[language];
        break;
    }

    response
      .status(result.status_code)
      .json({ success: result.success, result: result, message: message });

    if (result.status_code === 500) {
      compilerLogger.compiler(result);
    } else {
      infoLogger.info(result);
    }
  }
}
