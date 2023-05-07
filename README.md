In order to evaluate conflict-free data types for React Native apps, I need something simple to practice with. I'm also quite annoyed with our grocery list app, so why not.

## Scope

## As a user...

### I can create a grocery list with a name, so that I can easily find it later

- [x] Expo App
- [x] React Navigation. Simple Stack to start with
- [x] Get YJS to run on React Native
- [x] Get y-websocket to run on React Native
- [ ] Be able to store the YJS blob somewhere on device (temporary until we can make a backend for YJS)
- [ ] Create a root document with a sub document for the list
- [x] Screen to show lists (front page for now)
- [ ] Prompt to create a new list

### I can add an item to my grocery list so that I can buy it later

- [x] Screen to show a grocery list, by ID
- [x] FlatList to render item previews.
- [ ] Prompt to add a new item (temporary)
- [x] Store the new item on the document

### I can remove an item I accidentally added so that I don't buy it by accident

- [ ] Be able to swipe left on the item to delete it from the document

### I can mark an item as bought, so that my significant other doesn't buy the same thing

- [ ] Be able to click the item so mark it bought
- [ ] Have a timeout, where it's possible to undo the change before re-ordering the list

### I can make changes to my list even when I don't have Internet.

### I can see the latest changes to my list as soon as I'm online again.