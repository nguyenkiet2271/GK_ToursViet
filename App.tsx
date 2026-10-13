import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { groupByCity, formatDate, Tour } from './utils/tour';
import TourItem from './components/TourItem';

const API_URL = 'https://6abb5fabb2118ed7abb86697.mockapi.io/tours';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); 

  const fetchTours = (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        setTours(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTours(true);
  }, []);

  const handlePressTour = (tour: Tour) => {
    Alert.alert(
      'Thông tin tour',
      `Tên tour: ${tour.name}\nNgày KH: ${formatDate(tour.departure)}\nSố ngày: ${tour.days} ngày\nGiá: ${tour.price.toLocaleString('vi-VN')} ₫`
    );
  };

  const handleToggleFavorite = async (id: string, next: boolean) => {
    setTours((prevTours) =>
      prevTours.map((item) =>
        item.id === id ? { ...item, isFavorite: next } : item
      )
    );

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: next }),
      });

      if (!response.ok) {
        throw new Error('Cập nhật thất bại');
      }
    } catch (error) {
      setTours((prevTours) =>
        prevTours.map((item) =>
          item.id === id ? { ...item, isFavorite: !next } : item
        )
      );
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích');
    }
  };

  const favoriteTours = useMemo(() => {
    return tours.filter((item) => item.isFavorite);
  }, [tours]);

  const filteredTours = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return tours;
    return tours.filter((tour) =>
      tour.name.toLowerCase().includes(keyword)
    );
  }, [tours, searchText]);

  const sections = useMemo(() => {
    return groupByCity(filteredTours);
  }, [filteredTours]);

  const renderHeader = () => (
    <View style={styles.favoriteSection}>
      <Text style={styles.favoriteTitle}>
        Tour yêu thích ({favoriteTours.length})
      </Text>
      {favoriteTours.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có tour yêu thích</Text>
      ) : (
        <FlatList
          horizontal
          data={favoriteTours}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact={true}
              onPress={handlePressTour}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tour Việt</Text>
          <Text>23649011 – Nguyễn Đỗ Anh Kiệt</Text>
          <TextInput
            placeholder="Tìm tour theo tên..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy tour phù hợp</Text>
              </View>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>{title}</Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                compact={false}
                onPress={handlePressTour}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginTop: 5,
  },
  favoriteSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerSection: {
    backgroundColor: '#e0e0e0',
    padding: 8,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
});