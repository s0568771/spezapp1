package daos

import javax.inject.Inject
import model.Food
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class FoodDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
                        (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {
  import profile.api._

  private val Foods = TableQuery[FoodTable]

  def all(): Future[Seq[Food]] = db.run(Foods.result)

  def insert(food: Food): Future[Unit] = {
    db.run(Foods.insertOrUpdate(food)).map { _ => () }
  }
//  def delete(id: Int): Future[Unit] = db.run(Foods.filter(_.id === id).delete)

  //  def searchByPrice(price: Int): Future[Seq[Mensa]] = db.run(
  //    Mensen.filter(_.price === price)
  //      .result)

  private class FoodTable(tag: Tag) extends Table[Food](tag, "FOODS") {
    def id = column[String]("ID", O.PrimaryKey)
    def name = column[String]("NAME")

    def * = (id, name) <> (Food.tupled, Food.unapply)
  }
}