import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { formatDate, getSeatLabel, Tour } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItem: React.FC<TourItemProps> = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}) => {
  const isSeatsLow = tour.seats <= 3;
  const formattedPrice = tour.price.toLocaleString('vi-VN') + ' ₫';

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.compactContainer]}
        onPress={() => onPress(tour)}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: tour.image }} style={styles.compactImage} />
          <TouchableOpacity
            testID="fav-btn"
            style={styles.favBtnCompact}
            onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
          >
            <Text style={styles.favText}>{tour.isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {tour.name}
        </Text>
        <Text>{formattedPrice}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, styles.normalContainer]}
      onPress={() => onPress(tour)}
    >
      <Image source={{ uri: tour.image }} style={styles.normalImage} />

      <View style={styles.info}>
        <Text style={styles.name}>{tour.name}</Text>
        <Text>{tour.city}</Text>
        <Text>📅 {formatDate(tour.departure)} · {tour.days} ngày</Text>
        <Text>{formattedPrice}</Text>
        <Text style={isSeatsLow ? styles.redText : undefined}>
          {getSeatLabel(tour.seats)}
        </Text>
      </View>

      <TouchableOpacity
        testID="fav-btn"
        onPress={() => onToggleFavorite(tour.id, !tour.isFavorite)}
      >
        <Text style={styles.favText}>{tour.isFavorite ? '♥' : '♡'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(TourItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  normalContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  compactContainer: {
    width: 160,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 8,
  },
  normalImage: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
  },
  compactImage: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  favBtnCompact: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  redText: {
    color: 'red',
  },
  favText: {
    fontSize: 22,
    color: 'red',
  },
});