# arm64
docker build  -t language-base ./language-base-arm
docker build  -t hadoop-base ./hadoop-base
docker build  -t spark-base ./spark-base

docker build  -t namenode ./namenode
docker build  -t datanode ./datanode
docker build  -t resourcemanager ./resourcemanager
# docker build  -t yarntimelineserver ./yarntimelineserver arm으로 실행시 문제 발생
docker build  -t sparkhistoryserver ./sparkhistoryserver
docker build  -t zeppelin ./zeppelin
