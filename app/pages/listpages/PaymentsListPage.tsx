import { View, Text } from 'react-native'
import React from 'react'
import ListPageWrapper from '@/hoc/ListPageWrapper'

const PaymentsListPage = () => {
  return (
    <View>
      <Text>PaymentsListPage</Text>
    </View>
  )
}

export default ListPageWrapper(PaymentsListPage,"Payments")