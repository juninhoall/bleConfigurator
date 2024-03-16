import { DatabaseConnection } from './database-connection'

var db = null
export default class DatabaseInit {
    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }
    private InitDb() {
        var sql = [
            `DROP TABLE IF EXISTS configurator;`,

            `create table if not exists typeFields (
            id integer primary key autoincrement,
            name text    
            )`,

            `create table if not exists configurator (
            id integer primary key autoincrement,
            label text,
            internalId text,
            type_id int,
            foreign key (type_id) references type (id)
            );`,

            `insert into type (name) values('text');`,
            `insert into type (name) values('button');`,
            `insert into type (name) values('select');`,
            `insert into type (name) values('number');`
        ];

        db.transaction(
            tx => {
                for (var i = 0; i < sql.length; i++) {
                    console.log("execute sql : " + sql[i]);
                    tx.executeSql(sql[i]);
                }
            }, (error) => {
                console.log("error call back : " + JSON.stringify(error));
                console.log(error);
            }, () => {
                console.log("transaction complete call back ");
            }
        );
    }

}