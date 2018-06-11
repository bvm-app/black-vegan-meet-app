export const env = {
  DEFAULT: {
    userImagePlaceholder: 'assets/imgs/user_placeholder.png',
    eventImagePlaceholder: 'assets/imgs/event_placeholder.png',
    likeImage: 'assets/imgs/like.png',
    nopeImage: 'assets/imgs/nope.png',
    imagePlaceholder: 'assets/logo.png',

    icons: {
      Logo: 'assets/logo.png',
      LogoWithText: 'assets/logo_with_text.png',
      Search: 'assets/menu-icons/Search.svg',
      Messages: 'assets/menu-icons/Messages.svg',
      ViewedMe: 'assets/menu-icons/View me.svg',
      MyProfile: 'assets/menu-icons/My profile.svg',
      Events: 'assets/menu-icons/Nearby events.svg',
      Restaurants: 'assets/menu-icons/Nearby restaurants.svg',
      GroceryStores: 'assets/menu-icons/Nearby grocery stores.svg',
      Swipe: 'assets/menu-icons/Swipe icon.svg',
      AdviceCorner: 'assets/menu-icons/Advice Corner.svg'
    },
  },
  // PROD
  // FIREBASE: {
  //   apiKey: 'AIzaSyA-AkfUkB2ESqsvmlUqBfYdzFz-D_J932E',
  //   authDomain: 'black-vegan-meet.firebaseapp.com',
  //   databaseURL: 'https://black-vegan-meet.firebaseio.com',
  //   projectId: 'black-vegan-meet',
  //   storageBucket: 'black-vegan-meet.appspot.com',
  //   messagingSenderId: '237081629673'
  // }
  // DEV
  FIREBASE: {
    apiKey: 'AIzaSyBf9FgZ2RpR6bHNDEPB4OSZDAaKP5BD9aw',
    authDomain: 'bvm-dev-firebase.firebaseapp.com',
    databaseURL: 'https://bvm-dev-firebase.firebaseio.com',
    projectId: 'bvm-dev-firebase',
    storageBucket: 'bvm-dev-firebase.appspot.com',
    messagingSenderId: '1038454495212'
  }
};
