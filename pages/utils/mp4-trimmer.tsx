import dynamic from 'next/dynamic'

const Mp4Trimmer = dynamic(() => import('@/components/mp4-trimmer-client'), {
  ssr: false,
})

export default Mp4Trimmer
