# Blue X Mobile App

This folder is for the mobile frontend app.

The mobile app owns:

- Authentication screens
- Profile page
- Scanner page
- Dashboard page
- Navigation
- API calls to the backend
- Loading states and error display

The mobile app must not call external payment verification providers directly. It only calls the Blue X backend APIs.

## Folder Structure

```text
mobile/
  src/
    screens/
      auth/
      profile/
      scanner/
      dashboard/
    components/
      common/
      scanner/
      dashboard/
    navigation/
    services/
      api/
    hooks/
    store/
    types/
    utils/
    assets/
  tests/
```

Developers should add the actual React Native/Expo or Flutter project files here after the mobile framework is finalized.
