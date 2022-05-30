// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import React, { useState } from "react";

// const Tree = (props)=>{
    
//     return (
//         <div className = "d-tree">
//         <ul className="d-flex d-tree-container flex-column">
//             {props.entities.map((ent) => (
//                 <TreeNode entity={ent} data={props.entData}/>
//             ))}
//         </ul>
        
//         </div>
//     )
// }

// const TreeNode = ({ entity, entData }) => {
//     const [childVisible, setChildVisiblity] = useState(false);
  
//     // const hasChild = node.children ? true : false;

//     return (
//       <li className="d-tree-node border-0">
//         <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
//           {(
//             <div
//               className={`d-inline d-tree-toggler ${
//                 childVisible ? "active" : ""
//               }`}
//             >
//               <FontAwesomeIcon icon="caret-right" />
//             </div>
//           )}
  
//           <div className="col d-tree-head">
//             <i className="fa fa-folder"> </i>
//             {entity}
//           </div>
//         </div>
  
//         {childVisible && (
//           <div className="d-tree-content">
//             <ul className="d-flex d-tree-container flex-column">
//                 {Object.keys(entData[entity][0]).map(x=>{
//                         return (
//                             <div className="dropdown-item" onClick={updQuery}>{x}</div>
//                         )
//                     })}
//             </ul>
//           </div>
//         )}
//       </li>
//     );
//   };

// export default Tree;


// <div className = "d-tree">
//                                         <ul className="d-flex d-tree-container flex-column">
//                                         <li className="d-tree-node border-0">
//                                              <div className="d-flex" onClick={(e) => setChildVisiblity((v) => !v)}>
//                                                 {<div className={`d-inline d-tree-toggler ${childVisible ? "active" : ""}`}>
//                                                     <FontAwesomeIcon icon="caret-right" />
//                                                 </div>}
//                                                 <div className="col d-tree-head">
//                                                     <i className="fa fa-folder"></i>
//                                                     <a data-value={entity} onClick={handleDD}>{entity}</a>
//                                                 </div>
//                                              </div>
//                                              {childVisible && (
//                                                 <div className="d-tree-content">
//                                                 <ul className="d-flex d-tree-container flex-column">
//                                                     {Object.keys(entData[entity][0]).map(x=>{
//                                                         return (
//                                                             <div className="col d-tree-head" onClick={updQuery}>
//                                                             <i className="fas fa-file"> </i>
//                                                             {x}
//                                                             </div>
//                                                         )
//                                                     })}
//                                                 </ul>
//                                                 </div>
//                                             )}
//                                         </li>
//                                         </ul>
//                                     </div>