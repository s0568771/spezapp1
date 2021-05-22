package controllers

import javax.inject._

import play.api.libs.json.Json
import play.api.mvc._

@Singleton
class HomeController @Inject()(cc: ControllerComponents) extends AbstractController(cc) {

  def appSummary = Action {
    Ok(Json.obj("content" -> "Scala Play React Seed!"))
  }

  def env() = Action { implicit request: Request[AnyContent] =>
//    Ok("Nothing to see here")
    Ok(System.getenv("JDBC_DATABASE_URL"))
  }
}
