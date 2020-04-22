# Filterer

Type-safe way to create filters array by assigning value to draft object

![Demo](./demo.gif)

```ts
interface Person {
  name: string;
  age: number;
  favourite: {
    food: Food[];
  };
  hasCar: boolean;
}

type Food = 'pizza' | 'hamburger';

const filters = createFilters<Person>((person) => {
  person.name = 'Bob';
  person.age = ['>', 20];
  person.favourite.food = ['includes', 'pizza'];
  person.hasCar = true;
});

console.log(filters);
// [
//   {
//     path: ['name'],
//     value: 'Bob'
//   },
//   {
//     path: ['age'],
//     value: ['>', 20]
//   },
//   {
//     path: ['favourite', 'food'],
//     value: ['includes', 'pizza']
//   },
//   {
//     path: ['hasCar'],
//     value: true
//   }
// ]
```

`yarn add filterer`

## Licence

MIT
