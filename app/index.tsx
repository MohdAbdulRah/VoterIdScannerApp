import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      autoScan();
    }, 3500);

    return () => clearInterval(interval);
  }, [scanning]);

  // ================================
  // 📌 OCR PROCESS FUNCTION (Reusable)
  // ================================
  const processOCR = async (imageUri: string) => {
    try {
      setLoading(true);

      const ocrResult = await TextRecognition.recognize(imageUri);

      let extractedText = "";

      ocrResult.blocks.forEach((block: any) => {
        block.lines.forEach((line: any) => {
          extractedText += line.text + " ";
        });
      });

      let cleanedText = extractedText
        .replace(/[^A-Z0-9]/gi, " ")
        .toUpperCase();

      const epicMatch = cleanedText.match(/\b[A-Z]{3}\d{7}\b/);

      if (epicMatch) {
        setResult(`EPIC: ${epicMatch[0]}`);
        setScanning(false);
      } else {
        Alert.alert("No valid Voter ID detected");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // ================================
  // 📷 AUTO CAMERA SCAN
  // ================================
  const autoScan = async () => {
    if (!cameraRef.current || loading || result !== "") return;

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        shutterSound: false as any,
      });

      await processOCR(photo.uri);
    } catch (error) {
      setLoading(false);
    }
  };

  // ================================
  // 🖼 PICK IMAGE FROM GALLERY
  // ================================
  const pickImageFromGallery = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission required to access gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setScanning(false);
        await processOCR(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ================================
  // 🔄 RESET SCAN
  // ================================
  const resetScan = () => {
    setResult("");
    setScanning(true);
  };

  // ================================
  // UI STATES
  // ================================

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} />

      {/* Scanning Overlay */}
      {result === "" && (
        <View style={styles.overlay}>
          <Text style={styles.scanText}>🔍 Scanning Voter ID...</Text>
        </View>
      )}

      {/* Upload Button */}
      {result === "" && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImageFromGallery}
        >
          <Text style={styles.uploadText}>📂 Upload from Gallery</Text>
        </TouchableOpacity>
      )}

      {/* Loader */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#00FFAA"
          style={styles.loader}
        />
      )}

      {/* Result Box */}
      {result !== "" && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>✅ Voter ID Detected</Text>
          <Text style={styles.epicText}>{result}</Text>

          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={resetScan}
          >
            <Text style={styles.scanAgainText}>🔄 Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ================================
// 🎨 STYLES
// ================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
  },
  scanText: {
    color: "#00FFAA",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
  },
  uploadButton: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "#00FFAA",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  uploadText: {
    fontWeight: "bold",
    color: "#000",
  },
  resultBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    padding: 20,
    alignItems: "center",
  },
  resultText: {
    color: "#00FFAA",
    fontSize: 18,
    fontWeight: "bold",
  },
  epicText: {
    color: "#fff",
    fontSize: 20,
    marginTop: 10,
  },
  scanAgainButton: {
    marginTop: 15,
    backgroundColor: "#00FFAA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanAgainText: {
    fontWeight: "bold",
    color: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
