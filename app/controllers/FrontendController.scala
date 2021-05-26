package controllers

import daos.MensaDAO
import javax.inject._
import model.Mensa
import play.api.Configuration
import play.api.data.Form
import play.api.data.Forms.{mapping, text}
import play.api.http.HttpErrorHandler
import play.api.mvc._

/**
  * Frontend controller managing all static resource associate routes.
  * @param assets Assets controller reference.
  * @param cc Controller components reference.
  */
@Singleton
class FrontendController @Inject()(mensaDao: MensaDAO, assets: Assets, errorHandler: HttpErrorHandler, config: Configuration, cc: ControllerComponents) extends AbstractController(cc) {

  def index: Action[AnyContent] = assets.at("index.html")

  def env() = Action { implicit request: Request[AnyContent] =>
//    Ok("Nothing to see here")
    Ok(System.getenv("JDBC_DATABASE_URL"))
  }

  def assetOrDefault(resource: String): Action[AnyContent] = if (resource.startsWith(config.get[String]("apiPrefix"))){
    Action.async(r => errorHandler.onClientError(r, NOT_FOUND, "Not found"))
  } else {
    if (resource.contains(".")) assets.at(resource) else index
  }

//  def getMensen() = Action.async {
//    mensaDao.all().map { case (mensen) => Ok("ok")}
//  }

//  val mensaForm = Form(
//    mapping(
//      "id" -> text(),
//      "name" -> text(),
//      "city" -> text(),
//      "address" -> text(),
//      "coordinates" -> text()
//    )(Mensa.apply)(Mensa.unapply))
}