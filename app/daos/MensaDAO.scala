package daos

import model.Mensa
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import javax.inject.Inject
import scala.concurrent.{ExecutionContext, Future}

class MensaDAO @Inject()(protected val dbConfigProvider: DatabaseConfigProvider)
                          (implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {
  import profile.api._

  private val Mensen = TableQuery[MensaTable]

  def all(): Future[Seq[Mensa]] = db.run(Mensen.result)

  def insert(mensa: Mensa): Future[Unit] = {
    db.run(Mensen.insertOrUpdate(mensa)).map { _ => () }
  }

//  def searchByPrice(price: Int): Future[Seq[Mensa]] = db.run(
//    Mensen.filter(_.price === price)
//      .result)

  private class MensaTable(tag: Tag) extends Table[Mensa](tag, "MENSEN") {
    def id = column[String]("ID", O.PrimaryKey)
    def name = column[String]("NAME")
    def city = column[String]("CITY")
    def address = column[String]("ADDRESS")
    def coordinates = column[String]("COORDINATES")

    def * = (id, name, city, address, coordinates) <> (Mensa.tupled, Mensa.unapply)
  }
}