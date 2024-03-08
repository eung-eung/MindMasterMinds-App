import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, StatusBar, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonLoader from '../components/UI/SkeletonLoading';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment-timezone';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/style';
import useAxiosAuth from '../lib/hooks/useAxiosAuth';

export default function ClassesScreen() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const [isLoading, setIsLoading] = useState(false)
    const [listClasses, setListClasses] = useState([])
    const [role, setRole] = useState('');
    const [userID, setUserID] = useState('');
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user ID
                const storedUserID = await AsyncStorage.getItem('userID');
                setUserID(storedUserID);

                // Fetch user data
                if (storedUserID) {
                    const response = await axiosAuth.get(
                        `/User/get-user-detail/${storedUserID}`
                    );
                    const userData = response.data;
                    setRole(userData.userRole.roleName);
                }

                // Fetch classes based on role
                if (role === 'Tutor') {

                    const response = await axiosAuth.get(`/Order/get-list-order-by-course-and-status-by-tutor?pageNumber=${page}&pageSize=5`);
                    console.log(response.data.data);
                    setListClasses(response.data.data);

                } else if (role === 'Student') {
                    console.log('vào student');

                    const response = await axiosAuth.get(`/Order/get-list-order-by-course-and-status-by-me?pageNumber=${page}&pageSize=5`);
                    console.log(response.data.data);
                    if (response.data.data.length === 0) {
                        setIsLoadingMore(false)
                    } else {
                        setIsLoadingMore(true)
                    }
                    setListClasses(prev => ([...prev, ...response.data.data]));

                }
            }
            // Fetch classes based on role

        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };
    const renderItem = ({ item }) => {
        return (
            <View style={{ backgroundColor: '#f3f5f9' }}>
                <View contentContainerStyle={styles.container}>
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => {
                            // handle onPress
                        }}>
                        <View style={styles.card}>

                                <View style={styles.cardBody}>
                                    <Text>
                                        <Text style={styles.cardTitle}>{item.courseSubject.subject.code} - </Text>{' '}
                                        <Text style={styles.cardName}>
                                            {item.courseSubject.subject.name}
                                        </Text>
                                    </Text>
                                    <View style={styles.cardRow}>
                                        <View style={styles.cardRowItem}>
                                            <FontAwesome5 name="calendar-alt" size={24} color="gray" />
                                            <Text style={styles.cardRowItemText}>
                                                {
                                                    moment.utc(item.study).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')
                                                }
                                            </Text>
                                        </View>

                                        <View style={styles.cardRowItem}>
                                            <FontAwesome5 name="clock" size={24} color="gray" />
                                            <Text style={styles.cardRowItemText}>
                                                {
                                                    item.quantity
                                                } session
                                            </Text>
                                        </View>
                                    </View>

                                <View style={styles.buttonGroup}>
                                    <Text style={styles.cardPrice}>
                                        <Text style={styles.cardPriceCurrency}>Status: </Text>
                                        <Text style={styles.cardPriceValue}>
                                            {
                                                item.statusOrder === "Confirmed"
                                                    ? "On Progress"
                                                    : item.statusOrder
                                            }
                                        </Text>
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // handle onPress
                                        }}>
                                        <View style={styles.btn}>
                                            <Text style={styles.btnText}>Go to course</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };


    const renderLoader = () => {
        console.log('render loadder: ', isLoadingMore);
        return isLoadingMore ? <ActivityIndicator /> : null;
    };


    const loadMoreItem = async () => {
        await fetchData(currentPage + 1)
        setCurrentPage(prev => prev + 1);
    };

    const refreshHandler = () => {
        setListClasses([])
        setCurrentPage(0)
        fetchData(0)
    }

    return (
        <>
            <StatusBar backgroundColor="#000" />
            {isLoading && <LoadingOverlay />}
            <FlatList
                refreshControl={
                    <RefreshControl
                        tintColor={GlobalStyles.colors.backgroundColorPrimary100}
                        refreshing={refreshing}
                        onRefresh={refreshHandler}
                    />}
                data={listClasses}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                ListFooterComponent={renderLoader}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    /** Card */
    card: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginVertical: 4
    },
    cardBody: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginRight: 8,
    },
    cardName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#5f697d',

    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        flexWrap: 'wrap',
        marginTop: 10,
        marginBottom: 10,
    },
    cardRowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginRight: 20,
        marginTop: 5
    },
    cardRowItemText: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: '500',
        color: '#5f697d',
    },
    cardPrice: {
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
        width: 200,
        marginRight: 25
    },
    cardPriceValue: {
        fontSize: 17,
        fontWeight: '700',
        color: '#3e8468',
    },
    cardPriceCurrency: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },

    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderWidth: 1,
        backgroundColor: '#93FDD3',
        borderColor: '#93FDD3',
    },
    btnText: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: 'black',

    },
    buttonGroup: {
        flexDirection: 'row',
        marginTop: 14
    }
});