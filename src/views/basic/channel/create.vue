<template>
  <channel-detail :is-edit="false" />
</template>

<script>
import ChannelDetail from './components/Detail'

export default {
  name: 'CreateChannel',
  components: { ChannelDetail }
}
</script>

