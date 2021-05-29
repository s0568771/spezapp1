#Appeteria ...

die App zeigt Dir die Speisen einer ausgewählten Mensa an.

Der Zugriff erfolgt auf Openmensa.org, dort kommen die Mensen und Speisen zurück.
Favoriten können gesetzt werden und werden lokal in der DB gespeichert.

Das Backend ist mit Scala/PlayFramework und das Frontend mit REACT und material-ui Framework erstellt worden.

Aufgrund der aktuellen Situation der Pandemie, sind viele Mensen geschlossen und liefern somit keine Speisen zurück.
Die Mensa "Hannover Contine" oder "Mensa PZH" liefern Speisen zurück.

##Hosted usage

Die App ist auf Heroku deployed worden:
https://spezapp1.herokuapp.com/

##Local usage

```
$ git clone URL
$ sbt clear
$ sbt stage
$ sbt run
$ cd ui/
$ npm install
$ npm start
```

