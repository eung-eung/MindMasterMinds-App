import { View, Text } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { AuthConText } from '../store/auth-context';

export default function FindTutorScreen() {
    const authCtx = useContext(AuthConText);
    const token = authCtx.accessToken;
    const [isNormal, setIsNormal] = useState(true)
    const [isLoading, setLoading] = useState(true)
    const [isCalculateFee, setIscalculateFee] = useState(false)
    const [majorName, setMajorName] = useState('');
    const [majorList, setMajorList] = useState([])
    const [subjectName, setSubjectName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('')
    const [feeNumber, setFeeNumber] = useState(0)
    const [subjectList, setSubjectList] = useState([])
    const [date, setDate] = useState(dayjs(new Date().setDate(new Date().getDate() + 1)))
    const [lessons, setLessons] = useState(1)
    const description = useRef<HTMLTextAreaElement>(null)
    const summary = useRef<HTMLInputElement>(null)
    const phone = useRef<HTMLInputElement>(null)
    
    return (
        <View>
            <Text>FindTutorScreen</Text>
        </View>
    )
}