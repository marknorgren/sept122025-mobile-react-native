import { Link } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from '@/contexts/ThemeContext';

export default function ModalScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.title, { color: colors.text }]}>This is a modal</Text>
      <Text style={[styles.subtitle, { color: colors.subtitle }]}>
        Swipe down or use the button to dismiss
      </Text>
      
      <Link href="/" dismissTo asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Go to home screen</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "700",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16
  },
  buttonText: { 
    color: "white", 
    fontSize: 16,
    fontWeight: '600'
  },
});
