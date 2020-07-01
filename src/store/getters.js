const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  language: state => state.app.language,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.currentSystemRoutes,
  routes: state => state.permission.routes
}
export default getters