import { useState } from 'react';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '@/store/useStore';

export function useProfile() {
  const { user, updateUser, history, restDays, setAccentColor } = useStore();

  const [name, setName] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);

  const stats = {
    workouts: history.length,
    restDays: restDays.length,
    streak: user.streak,
    xp: user.totalXp,
    level: user.level,
  };

  const handleSaveName = () => {
    if (name.trim() === '') {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    updateUser({ name });
    setIsEditing(false);
  };

  const handleExportData = async () => {
    const data = JSON.stringify({ user, history, restDays }, null, 2);
    await Clipboard.setStringAsync(data);
    Alert.alert('Copiado!', 'Seus dados foram copiados para a área de transferência.');
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para trocar sua foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      updateUser({ avatarUri: result.assets[0].uri });
    }
  };

  return {
    user,
    name,
    setName,
    isEditing,
    setIsEditing,
    stats,
    actions: {
      handleSaveName,
      handleExportData,
      handlePickImage,
      handleSetAccentColor: setAccentColor,
    },
  };
}
