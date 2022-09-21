import { effect } from "./effect/index.js";
import {ref} from './reactive/index.js'

const data = {
  age: 18
}
const obj = ref(data)

effect(() => {
  console.log(
    obj.age
  )
})

obj.age++