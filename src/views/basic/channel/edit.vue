<template>
  <channel-detail :is-edit="true" />
</template>

<script>
import ChannelDetail from './components/Detail'

export default {
  name: 'EditChannel',
  components: { ChannelDetail }
}
</script>
