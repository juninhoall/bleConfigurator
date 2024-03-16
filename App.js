import {LogBox, SafeAreaView, StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import {useEffect, useState} from "react";
import * as SQLite from 'expo-sqlite';

export default function App() {
  const db = SQLite.openDatabase("nomeDoBanco.db");
  const [label, setLabel]= useState();
  const [componentType, setComponentType] = useState();
  const [internalId, setInternalId] = useState();
  const [order, setOrder] = useState();

  const [itemsConfigurator, setItemsConfigurator] = useState([])

  const createTableConfigurator = async () => {
    await db.transaction(tx => {
      tx.executeSql(
          "create table if not exists configurator (id integer primary key not null, label text, ordering int, componentType text, internalId text UNIQUE);",
          [],
          () => { console.log('Tabela criada com sucesso!'); },
          error => { console.log('Erro ao criar a tabela: ' + error.message); }
      );

    });
  }

  const dropDataBase = () => {
    db.transaction(tx => {
      tx.executeSql(
          "drop table configurator;",
          [],
          (_, { rows }) => { console.log(JSON.stringify(rows)); },
          error => { console.log('Erro ao tentar deletar o banco de dados: ' + error.message); }
      );
    });
  }

  const getAllConfigurator = () => {
    db.transaction(tx => {
      tx.executeSql(
          "select * from configurator",
          [],
          (_, { rows: { _array } }) => {
            console.log(`CONSULTA`);
            console.log(_array);
            setItemsConfigurator([..._array])
          },
          error => { console.log('Erro na consulta: ', error); }
      );
    });
  }
  useEffect(() => {
    createTableConfigurator()
  }, []);
  return (
      <View style={styles.container}>
          <SafeAreaView>
            <View style={{display: "flex", flexDirection: "column", flexWrap: "wrap"}}>
              <View  style={{display: "flex"}}>
                <Text>Label</Text>
                <TextInput style={{width: 100, borderRadius: 30, borderWidth: 1, padding: 5}} onChangeText={setLabel} />
              </View>
              <View  style={{display: "flex"}}>
                <Text>Order</Text>
                <TextInput style={{width: 100, borderRadius: 30, borderWidth: 1, padding: 5}} onChangeText={setOrder} />
              </View>
              <View  style={{display: "flex"}}>
                <Text>Component Type</Text>
                <TextInput style={{width: 100, borderRadius: 30, borderWidth: 1, padding: 5}} onChangeText={setComponentType} />
                <Text>TEXT, NUMBER, SELECT, BUTTON</Text>
              </View>
              <View  style={{display: "flex"}}>
                <Text>Internal Id To Save</Text>
                <TextInput style={{width: 100, borderRadius: 30, borderWidth: 1, padding: 5}}
                  onChangeText={setInternalId}
                />

              </View>

              <View>
                <TouchableHighlight
                    style={{
                      padding: 10,
                      borderRadius: 30,
                      backgroundColor: "gray"
                    }}
                    onPress={() => {
                      console.log(`${label}, ${componentType}, ${internalId}`)

                      db.transaction(tx => {
                        tx.executeSql(
                            "insert into configurator (label, componentType, internalId, ordering) values (?, ?, ?, ?);",
                            [label, componentType, internalId, order],
                            (_, { rows }) => { console.log(JSON.stringify(rows)); },
                            error => { console.log('Erro ao inserir: ' , error); }
                        );
                      });

                      getAllConfigurator();

                }}>
                  <Text>Save Values</Text>
                </TouchableHighlight>
                <TouchableHighlight
                 onPress={() => {
                   dropDataBase()
                   createTableConfigurator()
                   setItemsConfigurator([])
                 }}
                >
                  <Text> Apagar banco </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => {
                    getAllConfigurator()
                  }}
                >
                  <Text>Buscar todos os dados</Text>
                </TouchableHighlight>

                <Text>
                    {itemsConfigurator.map((item, index) => {
                        return (
                            <View key={index}>
                              <Text>{item.label}</Text>
                              <TextInput keyboardType={'numeric'} key={index} style={{width: 100, borderRadius: 30, borderWidth: 1, padding: 5}} />
                            </View>
                        )
                    })}
                </Text>
              </View>
            </View>
          </SafeAreaView>

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});
