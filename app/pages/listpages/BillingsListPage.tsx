import { View, Text } from 'react-native'
import React from 'react'
import ListPageWrapper from '@/hoc/ListPageWrapper'

const BillingsListPage = () => {
  return (
    <View>
      <Text>BillingsListPage</Text>
    </View>
  )
}

export default ListPageWrapper(BillingsListPage,"Billings & Invoices")