package controllers

import daos.{FoodDAO, MensaDAO}
import javax.inject._
import model.{Food, Mensa}
import play.api.data.Form
import play.api.data.Forms.{mapping, text}
import play.api.libs.json.Format.GenericFormat
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

@Singleton
class HomeController @Inject()(foodDAO: FoodDAO, mensaDAO: MensaDAO, cc: ControllerComponents) extends AbstractController(cc) {

//  implicit val produktFormat: Format[Food] = Json.format[Food]

  def appSummary = Action {
    Ok(Json.obj("content" -> "Scala Play React Seed!"))
  }
  def env() = Action { implicit request: Request[AnyContent] =>
        Ok("Nothing to see here")
//    Ok(System.getenv("JDBC_DATABASE_URL"))
  }
  def getAll = Action.async { implicit request =>
//    val mensa: Mensa = mensaForm.bindFromRequest.get
    mensaDAO.all().map { mensa => Ok(Json.toJson(mensa.toString())) }
  }
  def insertProdukt() = Action.async { implicit request =>
    val mensa: Mensa = mensaForm.bindFromRequest.get
    mensaDAO.insert(mensa).map(_ => Redirect(routes.FrontendController.index()))
  }
  def insertFood() = Action.async { implicit request =>
    val food: Food = foodForm.bindFromRequest.get
    foodDAO.insert(food).map(_ => Redirect(routes.FrontendController.index()))
  }
//  def deleteFood() = Action.async { implicit request =>
//    val food: Food = foodForm.bindFromRequest.get
//    foodDAO.delete(food).map(_ => Redirect(routes.FrontendController.index()))
//  }
  def getAllFood() = Action.async { implicit request =>
    foodDAO.all().map{ food => Ok(Json.toJson(food.toString()))}
  }


    val mensaForm = Form(
      mapping(
        "id" -> text(),
        "name" -> text(),
        "city" -> text(),
        "address" -> text()
      )(Mensa.apply)(Mensa.unapply))

  val foodForm = Form(
    mapping(
      "id" -> text(),
      "name" -> text()
    )(Food.apply)(Food.unapply))

}
