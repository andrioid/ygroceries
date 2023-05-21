In order to evaluate conflict-free data types for React Native apps, I need something simple to practice with. I'm also quite annoyed with our grocery list app, so why not.

# Current Status

Needs polish, lots of polish. Persistence seems to be working for both native and web. Definitely not ready for any of the app stores yet.

# Vision

### Opinionated

Ruthlessly optimised for grocery shopping. Other use-cases may be possible, but not directly supported.

### Works out of the box

No user-registration prompts or anything preventing you from using it within seconds of installing it.

### Business model (if I take this further)

- Free for single users
- Premium for co-operation features
  - Ads
  - In app purchases

I don't mind the app itself being free, but hosting and maintaining the syncing infrastructure requires both time and money.

# Scope

## As a user...

### I can see bought items at the bottom of the list

### I can clear the list of already bought items

### I can see list of recent changes

### I can easily access my frequently used items when adding to list

- [ ] Add the necessary meta-data to items to show the most recent items
- [ ] Filter items onChange

### I can see if there are other people working on my list.

- [ ] Decide how to handle app-state so we can store user's name
  - [ ] A: Context and AsyncStorage.
  - [ ] B: xstate and AsyncStorage.
- [ ] Implement awareness over websockets.

### I can ask my partner to review certain items on our list

When you're not at home, but you plan on going shopping later. Then you can quickly request someone at home to review the list.

- [ ] Implement basic actionable push notifications
- [ ] Schedule sending it, but don't send right away
- [ ] Partner can confirm or remove items
- [ ] Add a swipeable item with "Ask" to mark the item as "uncertain"

### I can group by items into catagories and sort the list by them

Super market chains usually have a floor plan that follows a certain order. So, it makes sense to show the items you're passing first, first.

- [ ] Create default catagories. No names, just colors.
- [ ] Be able to assign a color to an item in a quick way
- [ ] Be able to edit the catagory name
- [ ] Be able to edit catagory icon

### I can create a grocery list with a name, so that I can easily find it later

- [x] Expo App
- [x] React Navigation. Simple Stack to start with
- [x] Get YJS to run on React Native
- [x] Get y-websocket to run on React Native
- [x] Screen to show lists (front page for now)
- [ ] Be able to get a list of grocery lists from YJS
  - [ ] A: Figure out a way to find existing maps on a document
  - [ ] B: Get subdocuments to work, and use `doc.getMap().entries`
  - [ ] C: Store an index under a known key in the document
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
  - [ ] Debounce persistance, so that we're not constantly hammering the FS

### I can see the latest changes to my list as soon as I'm online again.

- [x] Websockets. Reevaluate later.

### I can optionally share and control who has access my to list

Sending everything to everyone works right now; but there's not a lot of control involved.

- [ ] Decide on a backend. Basically a controlled blob storage.
  - [ ] A: Supabase. Realtime with a blob column could be a good fit
- [ ] Decide on a protocol
  - [ ] A: y-websocket and adjust it to my needs
  - [ ] B: trpc
  - [ ] C: GraphQL w. subscriptions over websocket
