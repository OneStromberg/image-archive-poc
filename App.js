/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Button,
  Image
} from 'react-native';
import storage from '@react-native-firebase/storage';
import { unzip } from 'react-native-zip-archive';
import RNFetchBlob from 'rn-fetch-blob';

const archiveName = 'archive.zip';
const dirs = RNFetchBlob.fs.dirs;

const App: () => React$Node = () => {
  const [path, setPath] = React.useState();
  RNFetchBlob.fs.exists(dirs.DocumentDir + '/1.jpg').then(v => v && setPath({ uri: dirs.DocumentDir + '/1.jpg' }))
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View>
          <Button
            title="load"
            onPress={async () => {
              const reference = await storage().ref(archiveName).getDownloadURL();

              RNFetchBlob.config({
                path: dirs.DownloadDir + '/' + archiveName,
                fileCache: true,
                overwrite: true,
              })
                .fetch('GET', reference)
                .then((res) => {
                  unzip(res.path(), dirs.DocumentDir).then((path) => {
                    console.log(`unzip completed at ${path}`)
                    setPath({ uri: path + '/1.jpg' })
                  });
                  console.log('The file saved to ', res.path());
                });
            }}
          />
          {path && <Image style={{ height: 100, width: 100 }} source={path} />}
        </View>
      </SafeAreaView>
    </>
  );
};

export default App;
