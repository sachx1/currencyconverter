import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = "http://api.exchangeratesapi.io/v1/latest?access_key=0d697180ec4be5ace6986f796c00b5ea&format=1";

function App() {

  const[currencyOptions, setCurencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  console.log(exchangeRate)
  
  let toAmount, fromAmount
  if (amountInFromCurrency){
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const FirstCurrency = Object.keys(data.rates)[0]
        setCurencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(FirstCurrency)
        setExchangeRate(data.rates[FirstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency!= null && toCurrency!= null){
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value);
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value);
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow 
        currencyOptions={currencyOptions}
        selectCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount = {handleFromAmountChange}
        amount={fromAmount}
      />
      <div className = "equals">=</div>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency= {toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount = {handleToAmountChange}
        amount={toAmount}
      />
   </>
  );
}

export default App;
