export const name = "bar";
export let age = 18;

export const student = {
  age: age,
};

export function incrementAge() {
  age++;
  student.age++;
  console.log(age);
}

export function getInnerAge() {
  console.log(student.age);
}
