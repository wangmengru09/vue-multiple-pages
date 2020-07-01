// translate router.meta.title, be used in breadcrumb sidebar tagsview
import store from '@/store'
export function generateTitle(meta) {
  if ((meta.titleCn && !meta.titleEn) || (!meta.titleCn && meta.titleEn)) {
    return meta.titleCn ? meta.titleCn : meta.titleEn
  }
  const title = store.getters.language === 'zh' ? meta.titleCn : meta.titleEn
  return title
}
