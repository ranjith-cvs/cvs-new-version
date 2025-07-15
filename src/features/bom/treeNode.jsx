import React, { useState, useEffect, useRef } from 'react';
import Tree from 'react-d3-tree';
import getFetch from '../utils/api';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import '../style/treeNodeBOM.css';

const Tooltip = ({ x, y, content }) => {
  if (!content) return null; // Don't render if there's no content

  return (
    <div
      style={{
        position: 'absolute',
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '5px',
        pointerEvents: 'none',
        left: x,
        top: y,
        zIndex: 1000,
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    >
      {/* {content} */}
    </div>
  );
};

const TreeNode = ({ currentFGPart }) => {
  const [treeData, setTreeData] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });

  // UseEffect to fetch BOM data or set current part data
  useEffect(() => {
    if (currentFGPart && currentFGPart.length > 0) {
      console.log("BOM Tree node", currentFGPart);
      setTreeData(currentFGPart); // Update tree data with passed prop
    } else {
      fetchInfo(); // Otherwise, fetch default BOM data
    }
  }, [currentFGPart]);

  // Fetch BOM data from API
  const fetchInfo = async () => {
    try {
      const response = await getFetch("bom", "GET");
      console.log("Full BOM", response);
      // Only set state if the response is different from the current state
      if (JSON.stringify(response) !== JSON.stringify(treeData)) {
        setTreeData(response);
      }
    }
    catch (error) {
      console.error("Error fetching BOM:", error);
    }
  };

  // Tree container styling
  const containerStyles = {
    width: '100%',
    height: '600px',  // Adjusted height to fit more nodes
    border: '1px solid #ccc',
    position: 'relative', // Allow absolute positioning of the tooltip
  };

  const renderRectSvgNode = ({ nodeDatum, toggleNode }) => {
    const isParentNode = nodeDatum.children && nodeDatum.children.length > 0; // Identify parent nodes
    const colors = {
      0: "#43A047",
      1: "#29B6F6",
      2: "#90CAF9",
      3: "#FFB74D",
      4: "#f1f0e8",
      5: "lightgrey",
    };
    const _nodeColor = isParentNode ? colors[nodeDatum.partLevel] : "#BDBDBD";
    return (
      <g transform="translate(50,0)"> {/* Adjust node positioning */}
        <rect
          width="200"
          height="50"
          x="-100"  // Center horizontally
          y="-25"  // Center vertically
          rx={20}
          ry={25}
          fill={_nodeColor}
          //fill={isParentNode ?(nodeDatum.partLevel==0?"Red":"#f57f17")  : "#e0f7fa"} // Yellow for parent, light blue for child
          //stroke={_nodeColor} // Different stroke colors for distinction
          strokeWidth="2"
          onClick={toggleNode}
        />
        {/* Display node name */}
        {/* <text
        fill={isParentNode ? "#000" : "#004d40"} // Text color based on node type
        x="0"
        y="5"
        textAnchor="middle"
        fontWeight={isParentNode ? "bold" : "normal"}
         
      >
        {nodeDatum.name}
      </text> */}
        {/* Optional: Add additional node information */}
        {nodeDatum.partCode && (
          <text
            fill="#fff"
            x="0"
            y="5"
            textAnchor="middle"
            fontSize="18"
            //fontWeight= "bold"      
            onMouseEnter={(e) => {
              setTooltip({
                visible: true,
                content: `
                <strong>Part Code:</strong> ${nodeDatum.partCode}<br/>
                <strong>Part Name:</strong> ${nodeDatum.partName}<br/>
                <strong>Type:</strong> ${nodeDatum.partCatageroy || 'N/A'}<br/>
                <strong>Quantity:</strong> ${nodeDatum.partQty || 'N/A'}<br/>
                <strong>OnHand Qty:</strong> ${nodeDatum.onHand || '0'}<br/>
                <strong>ItemType:</strong> ${nodeDatum.itemType || 'N/A'}<br/>
              `,
                x: e.clientX - 550,
                y: e.clientY - 70,
              });
            }}
            onMouseLeave={() => setTooltip({ ...tooltip, visible: false })}
          >
            {nodeDatum.partCode}
          </text>
        )}
      </g>
    );
  };


  // Dynamic class based on path (link between nodes)
  const getDynamicPathClass = ({ source, target }) => {
    return target.children && target.children.length > 0 ? 'link__to-branch' : 'link__to-leaf';
  };

  const treeRef = useRef(null);

  const exportAsImage = () => {
    if (treeRef.current) {
      html2canvas(treeRef.current, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'tree-diagram.png';
        link.click();
      });
    }
  };
  const exportAsPDF = () => {
    if (treeRef.current) {
      html2canvas(treeRef.current, { useCORS: true, scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
        const pdf = new jsPDF('landscape', 'px', 'a4'); // Create a landscape PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); // Add image to PDF
        pdf.save('tree-diagram.pdf'); // Save the PDF
      });
    }
  };

  const exportToExcel = (treeData) => {
    console.log("Tree date-------->", treeData);

    // Transform treeData into a flat array
    const flattenTreeData = (node, parent = null) => {
      const { name, children, partQty } = node;
      const flatData = [{ id: node.id, name, parent, partQty }];

      if (children) {
        children.forEach((child) => {
          flatData.push(...flattenTreeData(child, name, partQty));
        });
      }

      return flatData;
    };

    // Assuming treeData is an array of root nodes
    const flatData = treeData.flatMap((node) => flattenTreeData(node));
    // Convert to worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tree Data');

    // Trigger file download
    XLSX.writeFile(wb, 'TreeData.xlsx');
  };

  // Recursive function to expand all nodes
  const expandAllNodes = (node) => {
    if (node.children) {
      node.collapsed = false; // Set collapsed to false for expanding
      node.children.forEach(expandAllNodes); // Recursive call for children
    }
  };

  // Recursive function to collapse all nodes
  const collapseAllNodes = (node) => {
    if (node.children) {
      node.collapsed = true; // Set collapsed to true for collapsing
      node.children.forEach(collapseAllNodes); // Recursive call for children
    }
  };

  const handleExpandAll = () => {
    const updatedTreeData = [...treeData]; // Copy current tree data
    updatedTreeData.forEach(expandAllNodes); // Expand all nodes recursively
    setTreeData(updatedTreeData); // Update state
  };

  const handleCollapseAll = () => {
    const updatedTreeData = [...treeData]; // Copy current tree data
    updatedTreeData.forEach(collapseAllNodes); // Collapse all nodes recursively
    setTreeData(updatedTreeData); // Update state
  };


  return (
    <div style={containerStyles}>
      {treeData.length > 0 ? (  // Ensure there's data before rendering
        <>
          {/* <button onClick={() => exportToExcel(treeData)}>Export to Excel</button> */}
          <button onClick={exportAsPDF}>Export as PDF</button>
          {/* <button onClick={handleExpandAll}>Expand All</button>
  <button onClick={handleCollapseAll}>Collapse All</button> */}
          {/* <button onClick={exportAsImage}>Export as Image</button> */}
          <div ref={treeRef} style={{ border: '1px solid #ccc', height: '100%', width: '100%' }}>
            <Tree
              data={treeData}
              orientation="horizontal"
              pathFunc="diagonal"
              pathClassFunc={getDynamicPathClass}
              initialDepth={1}
              renderCustomNodeElement={renderRectSvgNode}  // Render nodes using custom function
              translate={{ x: 200, y: 200 }}  // Centered horizontally
              nodeSize={{ x: 400, y: 60 }}    // Adjusted node size for better spacing
              zoom={0.43}
              zoomable={true}
              rootNodeClassName="node__root"
              branchNodeClassName="node__branch"
              leafNodeClassName="node__leaf"
            />
            {tooltip.visible && (
              <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} />
            )}
          </div>
        </>
      ) : (
        <div>No data available to display.</div>  // Placeholder for empty state
      )}
    </div>
  );
};

export default TreeNode;
