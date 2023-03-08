<div>
import DropDown from '../../common/DropDown.vue'

export default {
  name: 'HeaderContact',
  components: { DropDown },
  props: {
    positionProp: Boolean,
    linkAdminProp: Boolean,
  },
  data() {
    return {
      TokenData: '',
      position: this.positionProp || false,
      linkAdmin: this.linkAdminProp,
      dropHeader: [
        {
          dataDrop: {
            txtBtn: { drop: 'Pages', link: '/' },
            txtItem: [
              { item: 'Home', link: '/home' },
              { item: 'Shop', link: '/shop-page' },
              { item: 'Error', link: '/error' },
              { item: 'item1', link: '/1' },
            ],
          },
        },
        {
          dataDrop: {
            txtBtn: { drop: 'Blogs', link: '/' },
            txtItem: [{ item: 'item2', link: '/' }],
          },
        },
        {
          dataDrop: {
            txtBtn: { drop: 'Products', link: '/' },
            txtItem: [{ item: 'item2', link: '/' }],
          },
        },
      ],

      // dataDropAcc: {
      //   txtBtn: {
      //     drop: this.$store.state.token
      //       ? this.$store.state.token.userName
      //       : 'login',
      //     link: '/',
      //   },
      //   txtItem: [{ item: 'Logout', event: 'logOut' }],
      // },
      // dataDropLogin: {
      //   txtBtn: { drop: 'Login', link: '/login' },
      // },
    }
  },
  mounted() {
    // try {
    //   this.TokenData = this.$store.state.token
    // } catch (error) {
    // }
  },
  methods: {
    logOut() {
      window.localStorage.removeItem('token')
      this.$store.commit('setToken')
      this.TokenData = this.$store.state.token
      if (this.$router.currentRoute.matched[0].name === 'Admin')
        this.$router.push({ name: 'Home' })
    },
  },
}
</script>

<template>
  <div
    class="header__contact"
    :class="position ? 'positionFixed' : ''"
  >
    <div class="header__contact__linkPage">
      <div
        v-for="(item, i) in dropHeader"
        :key="i"
        class="header__contact__item"
      >
        <DropDown :data-drop="item.dataDrop" />
      </div>

    </div>
    <div class="header__contact__call">
      <span>
        <i class="fas fa-phone-volume" />
      </span>
      <span>
        <span>
          <img
            class="iconFlag"
            src="@/static/pc-static/common/icon/flag/VN.png"
            alt=""
          >
        </span>
        VN
      </span>
      <span>(+84) 777 444 933</span>
    </div>

    <div class="header__contact__linkPage">
      <RouterLink
        v-if="
          TokenData !== null && TokenData.userName == 'admin123' && !linkAdmin
        "
        to="/admin"
        class="header__contact__item fa-center textWhite"
      >
        <span><i class="fas fa-users-cog" /></span>Admin Page
      </RouterLink>
      <div
        v-if="TokenData == null"
        class="header__contact__item"
      >
        <span class="fa-center"><i class="fas fa-user" /></span>
        <span><DropDown :data-drop="dataDropLogin" /></span>
      </div>

      <div
        v-else
        class="header__contact__item"
      >
        <span class="fa-center"><i class="fas fa-user" /></span>
        <DropDown
          :data-drop="dataDropAcc"
          @logOut="logOut"
        />
      </div>
    </div>
  </div>
</template>

<style lang = 'scss'>
.header {
  display: block;
  block-size: auto;
  inline-size: 100%;

  /* background-image: url(~@/assets/img/bg.jpg); */
  &__contact {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #1a212e;
    block-size: 50px;
    color: white;
    font-weight: 500;
    inline-size: 100%;
    padding-block: 10px;
    padding-inline: 120px;

    &__item {
      /* padding: 0px 20px; */
      display: flex;
      color: white;

      span {
        padding-block: 0;
        padding-inline: 10px;
      }
    }

    &__item:hover span {
      color: white;
      text-shadow: 2px 2px 10px #fff;
    }

    &__linkPage {
      display: flex;
    }

    &__call {
      span {
        padding-block: 0;
        padding-inline: 5px;
      }
    }
  }
}

.iconFlag {
  block-size: 15px;
  inline-size: 15px;
}

.fa-center {
  display: flex;
  align-items: center;
  padding-block: 0;
  padding-inline: 10px;
}
</style>
