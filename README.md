# eTower-integrator


## Build Setup


```bash
# clone the project
git clone git@52.83.174.186:emilywang/etower-Integrator.git

# enter the project directory
cd etower-Integrator

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:3000


## Build

```bash
# build for stage environment
npm run build:stage

# build for qa environment
npm run build:qa

# build for pre environment
npm run build:pre

# build for production environment
npm run build:prod
```

## eslint

```bash
# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```


## 新手开发新功能的操作步骤

以financeSetting为例：在财务设置下，新增一个chargeZone页面
1. 在views下面，若已经存在财务设置模块（/financeSetting），则在此功能模块下面，新建一个chargeZone文件夹（eg：/chargeZone）。若不存在，则直接在views下面新建一个财务设置模块（/financeSetting），然后在financeSetting下面建具体的功能文件夹（假设：/chargeZone）。
2. 在chargeZone下面新建一个index.vue文件，这里就是具体的页面代码了。
3. *.vue文件，template模块是页面的html（注意：template中的html只能有一个根div）。script是js代码。style是样式代码（注意：当前文件的样式，一定要加scoped属性，避免污染全局样式）。
4. 变量：页面中的data中定义的复杂类型的变量，要移步到utils/data/financeSetting/chargeZone.js 中去定义。定义之后，在.vue页面的script中import进来，就可以使用了。
5. 请求：在/api下面创建一个financeSetting文件夹，在此文件夹下面，新建chargeZone.js文件，
