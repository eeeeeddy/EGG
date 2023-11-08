# amd64

docker build --platform linux/amd64  -t language-base ./language-base
docker build --platform linux/amd64  -t hadoop-base ./hadoop-base
docker build --platform linux/amd64  -t spark-base ./spark-base

docker build --platform linux/amd64  -t namenode ./namenode
docker build --platform linux/amd64  -t datanode ./datanode
docker build --platform linux/amd64  -t resourcemanager ./resourcemanager
docker build --platform linux/amd64  -t yarntimelineserver ./yarntimelineserver
docker build --platform linux/amd64  -t sparkhistoryserver ./sparkhistoryserver
docker build --platform linux/amd64  -t zeppelin ./zeppelin

docker-compose up -d
