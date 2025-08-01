import React, { useEffect } from 'react';
import { OTPWidget } from '@msg91comm/sendotp-react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';


const widgetId = 35674273364e323234363538;
const tokenAuth = {authToken};

const App = () => {
    useEffect(() => {
        OTPWidget.initializeWidget(widgetId, tokenAuth);
    }, [])

    const [number, setNumber] = useState('');

    const handleSendOtp = async () => {
        const data = {
            identifier: '91758XXXXXXX'
        }
        const response = await OTPWidget.sendOTP(data);
        console.log(response);  
    }

    return (
        <View>
            <TextInput
                placeholder='Number'
                value={number}
                keyboardType='numeric'
                style={{ backgroundColor: '#ededed', margin: 10 }}
                onChangeText={(text) => {
                    setNumber(text)
                }}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={()=>{
                    handleSendOtp()
                }}
            >
                <Text>
                    Send OTP
                </Text>
            </TouchableOpacity>
        </View>
    );
}
    
export default App;