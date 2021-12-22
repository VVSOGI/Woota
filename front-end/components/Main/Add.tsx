import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { NavigationProp } from "@react-navigation/core";

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
  },
});

interface AddProps {
  navigation: NavigationProp<any, any>;
}

const Add: React.FC<AddProps> = ({ navigation }) => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState<
    boolean | null
  >(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [camera, setCamera] = useState<any>(null);
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null && hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
      </View>

      <Button
        mode={"contained"}
        dark={true}
        color={"#4da8f3"}
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      >
        Flip Image
      </Button>
      <Button
        mode={"contained"}
        dark={true}
        color={"#4da8f3"}
        onPress={() => {
          takePicture();
        }}
      >
        Take Picutre
      </Button>
      <Button
        mode={"contained"}
        dark={true}
        color={"#4da8f3"}
        onPress={() => {
          pickImage();
        }}
      >
        Pick Image From Gallery
      </Button>
      <Button
        mode={"contained"}
        dark={true}
        color={"#4da8f3"}
        onPress={() => {
          navigation.navigate("Save", { image });
        }}
      >
        Save
      </Button>
      {image && <Image source={{ uri: image }} style={styles.imageContainer} />}
    </View>
  );
};

export default Add;
