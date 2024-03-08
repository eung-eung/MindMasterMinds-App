import { View, Text } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthConText } from '../store/auth-context';
import { axiosAuth } from '../lib/axios';

export default function FindTutorScreen({navigation}) {
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

    const getListMajors = async () => {
        const response = await axiosAuth.get('/Course?pageNumber=0&pageSize=100')
        setMajorList(response.data.data)
    }

    const getListSubjects = async (id) => {
        setIscalculateFee(true)
        const response = await axiosAuth.get(`/Subject/get-subject-by-courseId/${id}?pageNumber=0&pageSize=30`)
        setSubjectName(response.data.data[0].id)
        setIscalculateFee(false)
        setSubjectList(response.data.data)
    }

    const regexPhoneNumber = (phone) => {
        const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
        return phone.match(regexPhoneNumber) ? true : false;
    }

    const handlePhoneChange = (e) => {
        setPhoneNumber(e.target.value)
    }

    const getCourseSubjectId = async () => {
        const response = await axiosAuth.post('/CourseSubject/get-course-subject', {
            courseId: majorName,
            subjectId: subjectName
        })
        return response.data.id
    }

    const getTuitionFees = async () => {
        if (subjectName) {
            const courseSubjectId = await getCourseSubjectId()
            const fee = await axiosAuth.post('/Order/get-total-tuition-fee', {
                courseSubjectId,
                quantity: lessons,
                stateInfo: !isNormal
            })
            setFeeNumber(fee.data.message)
        }
    }

    useEffect(() => {
        setFeeNumber(0)
    }, [majorName])

    const handleSubmitPost = async (e) => {
        e.preventDefault()
        const order = {} 
        if (
            majorName &&
            subjectName &&
            description.current &&
            description.current.value.trim() &&
            summary.current &&
            summary.current.value.trim() &&
            phone.current &&
            regexPhoneNumber(phone.current?.value)
        ) {
            const courseSubjectId = await getCourseSubjectId()
            order.courseSubjectId = courseSubjectId
            order.description = description.current.value.trim()
            order.summary = summary.current.value.trim()
            order.quantity = lessons
            order.study = date.toDate()
            order.stateInfo = !isNormal
            order.phone = phone.current.value.trim()
            try {
                const response = await axiosAuth.post('/Order/missing-order-by-student', '5AE02E33-2C97-4562-B246-85113EA4CC54')
                console.log('money: ', response);

                // const response = await axiosAuth.post('/Order', {
                //     summary: order.summary,
                //     courseSubjectId: order.courseSubjectId,
                //     stateInfo: order.stateInfo,
                //     phone: order.phone,
                //     description: order.description,
                //     quantity: order.quantity,
                //     study: order.study
                // })
                toast.success('Posted successfully', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                // redirect('/listClasses')
                navigation.navigate('Classes')
            } catch (error) {
                toast.error(error.response.data.Message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }

        } else {
            toast.error('Please fill all fields', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });

        }


    }

    useEffect(() => {
        getTuitionFees()
    }, [subjectName, lessons, isNormal])

    const handleDateChange = (value, context) => {
        const currentDate = new Date().getTime()
        const pickedDate = new Date(value.$d).getTime()
        if (currentDate > pickedDate) {
            toast.error('You cannot choose a past date', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            setDate(dayjs(new Date().setDate(new Date().getDate() + 1)))
        }
    }
    const handleMajorChange = (event) => {
        const {
            target: { value },
        } = event;

        getListSubjects(value)
        setMajorName(
            value
        );
    };
    const handleSubjectChange = (event) => {
        const {
            target: { value },
        } = event;
        setSubjectName(
            value
        );
    };

    useEffect(() => {
        getListMajors()
    }, [])

//    useEffect(() => {
//         if (status !== 'loading') setLoading(false)
//         if (!session && status === 'unauthenticated') {
//             redirect('/signIn')
//         }
//     }, [status])

    return (
        <View>
            <Text>FindTutorScreen</Text>
        </View>
    )
}