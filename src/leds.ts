import rpio from 'rpio'
const ledConfig = require('./config.json')
let blinkInterval

export const leds = {}
ledConfig['leds'].forEach((led) => {
  leds[led['color']] = led['pin']
})

export const reset = (colour?: string) => {
  if (colour) {
    rpio.open(leds[colour], rpio.INPUT)
    rpio.write(leds[colour], rpio.HIGH)
  } else {
    ledConfig['leds'].forEach((led) => {
      rpio.open(led.pin, rpio.INPUT)
      rpio.write(led.pin, rpio.HIGH)
    })
  }
}

export const status = (colour?: string) => {
  if (colour) {
    rpio.open(leds[colour], rpio.OUTPUT)
    console.log(`Pin ${leds[colour]} (${colour}) is currently ` + (rpio.read(leds[colour]) ? 'high' : 'low'))
  } else {
    ledConfig['leds'].forEach((led) => {
      rpio.open(led.pin, rpio.OUTPUT)
      console.log(`Pin ${led.pin} (${led.color}) is currently ` + (rpio.read(led.pin) ? 'high' : 'low'))
    })
  }
}

export const ledOn = (colour: string) => {
  console.log('turning on ', colour)
  rpio.write(leds[colour], rpio.LOW)
}

const ledOff = (colour: string) => {
  console.log('turning off ', colour)
  rpio.write(leds[colour], rpio.HIGH)
}
export const blink = (colour: string, duration: number) => {
  console.log(colour)

  let counter = 0
  blinkInterval = setInterval(function () {
    if (counter >= duration) clearInterval(blinkInterval)
    rpio.open(leds[colour], rpio.OUTPUT)
    rpio.write(leds[colour], counter++ % 2 ? rpio.HIGH : rpio.LOW)
  }, 1000)

  reset(colour)
}

export const stopBlink = () => {
  clearInterval(blinkInterval)
  reset()
}
