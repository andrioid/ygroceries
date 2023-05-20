In order to evaluate conflict-free data types for React Native apps, I need something simple to practice with. I'm also quite annoyed with our grocery list app, so why not.

# Current Status

Needs polish, lots of polish. Persistence seems to be working for both native and web. Definitely not ready for any of the app stores yet.

# Scope

## As a user...

### I can create a grocery list with a name, so that I can easily find it later

- [x] Expo App
- [x] React Navigation. Simple Stack to start with
- [x] Get YJS to run on React Native
- [x] Get y-websocket to run on React Native
- [x] Screen to show lists (front page for now)
- [ ] Be able to get a list of grocery lists from YJS
  - [ ] A: Figure out a way to find existing maps on a document
  - [ ] B: Get subdocuments to work, and use `doc.getMap().entries`
- [ ] Prompt to create a new list
- [ ] Show existing lists on home screen

### I can add an item to my grocery list so that I can buy it later

- [x] Screen to show a grocery list, by ID
- [x] FlatList to render item previews.
- [x] Prompt for adding
- [x] Store the new item on the document

### I can remove an item I accidentally added so that I don't buy it by accident

- [x] Be able to swipe left on the item to delete it from the document

### I can mark an item as bought, so that my significant other doesn't buy the same thing

- [x] Be able to click the item so mark it bought
- [ ] Have a timeout, where it's possible to undo the change before re-ordering the list

### I can make changes to my list even when I don't have Internet.

- [x] YJS doc persistence (web). Using y-indexeddb.
- [x] YJS doc persistence (native). Using expo-filesystem.

### I can see the latest changes to my list as soon as I'm online again.

- [x] Websockets. Reevaluate later.

### I can see if there are other people working on my list.

- [ ] Decide how to handle app-state so we can store user's name
  - [ ] A: Context and AsyncStorage.
  - [ ] B: xstate and AsyncStorage.
- [ ] Implement awareness over websockets.
