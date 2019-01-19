// info has: position, the name, orientation, condition_flags, mode
Vue.component("object-examine", {
	props: ["info"],
	template: `
		<div id="this.info.name" v-on:click.once="pickup(this.info.name)" v-show="store.state.inventory.includes('this.info.name') == false && this.info.orientation == store.state.orientation && mode == this.info.name"></div>
	`
})