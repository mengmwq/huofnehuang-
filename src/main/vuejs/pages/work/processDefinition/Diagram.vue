<template>
  <div :id="id"></div>
</template>
<script>
import go from "gojs";
if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
 var $ = go.GraphObject.make;
export default {
  props: ["modelData",'id'], // accept model data as a parameter
  mounted() {
    var self = this;
    var myDiagram = $(go.Diagram, this.id, {
      layout: $(go.TreeLayout, {
        angle: 90,
        arrangement: go.TreeLayout.ArrangementHorizontal
      }),
      "undoManager.isEnabled": true,
      "initialContentAlignment": go.Spot.TopLeft,
      //"editable":false,  //文本是否可编辑
      //"isMultiline:true,	//编辑时是否允许换行	默认true
      //"maxLines":2, //设置文本显示的最大行数
      //minSize: ///最小大小	new go.Size(10, 16)，控制了最大大小后，文本就会自动换行了
      //maxSize:	//最大大小
      //visible	设置是元素是否可见	true为可见，false为不可见，
      // Model ChangedEvents get passed up to component users
      ModelChanged: function(e) {
        self.$emit("model-changed", e);
      },
      ChangedSelection: function(e) {
        self.$emit("changed-selection", e);
      }
    });
    //一种类型的节点：审批节点
    myDiagram.nodeTemplateMap.add("circle",
          $(go.Node, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape,
                      { figure: "Ellipse" },
                      { margin:4,
                      fill: "#ffffff"
                    }),
                    //new go.Binding("fill", "color")),
                  $(go.TextBlock,
                    { margin: 5 },
                    new go.Binding("text", "text"))
                )
            )//go.Node的括号
    );
    //第二种类型的节点:条件节点
    myDiagram.nodeTemplateMap.add("diamond",
          $(go.Node, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, "Diamond", {
                        minSize: new go.Size(45, 40),
                        margin:4,
                        fill: "#ffffff",
                        // stroke: null
                    }),
                    $(
                      go.TextBlock,
                      { margin: 4, editable: false },
                      new go.Binding("text").makeTwoWay()
                    )
                )
          )//go.Node的括号
    );
    //第三种类型文本节点: 无边框无背景：是否节点
    myDiagram.nodeTemplateMap.add("whether",
          $(go.Node, "Spot",
                $(go.Panel, "Auto",
                    $(go.Shape, "RoundedRectangle", {
                        margin:4,
                        fill: "#ffffff",
                        stroke: null
                    }),
                    $(
                      go.TextBlock,
                      { margin: 4, editable: false },
                      new go.Binding("text").makeTwoWay()
                    )
                )
          )//go.Node的括号
    );

    myDiagram.linkTemplate = $(
      go.Link,
      { relinkableFrom: true, relinkableTo: true },
      $(go.Shape),
      $(go.Shape, { toArrow: "OpenTriangle" })
    );

    this.diagram = myDiagram;

    this.updateModel(this.modelData);
  },
  watch: {
    modelData: function(val) {
      this.updateModel(val);
    }
  },
  methods: {
    model() {
      return this.diagram.model;
    },
    updateModel(val) {
      // No GoJS transaction permitted when replacing Diagram.model.
      if (val instanceof go.Model) {
        this.diagram.model = val;
      } else {
        var m = new go.GraphLinksModel();
        if (val) {
          for (var p in val) {
            m[p] = val[p];
          }
        }
        this.diagram.model = m;
      }
    },
    updateDiagramFromData() {
      this.diagram.startTransaction();
      // This is very general but very inefficient.
      // It would be better to modify the diagramData data by calling
      // Model.setDataProperty or Model.addNodeData, et al.
      this.diagram.updateAllRelationshipsFromData();
      this.diagram.updateAllTargetBindings();
      this.diagram.commitTransaction("updated");
    }
  }
};
</script>

