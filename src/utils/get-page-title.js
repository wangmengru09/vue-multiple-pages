import defaultSettings from '@/settings'
// import i18n from '@/lang/index'

const title = defaultSettings.title || 'eTower'

export default function getPageTitle(pageTitle) {
  // if (pageTitle) {
  //   const name = i18n.t('route.' + pageTitle)
  //   return `${name} - ${title}`
  // }
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
