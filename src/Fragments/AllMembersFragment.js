import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import './AllMembers.css'
import { Button } from '@material-ui/core';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import jsPDF from "jspdf";
import "jspdf-autotable";
import { createBrowserHistory } from "history";
import ReactPaginate from 'react-paginate';
const history = createBrowserHistory({ forceRefresh: true });

export class AllMembersFragment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: null,
            search: '',
            refresh: false,
            page:0,
            totalPages:0,
        }
    }
    searchMenbers = (text) => {
        this.setState({ search: text })
    }
    componentDidMount() {
        const url = 'https://sipcityapi.mobileprogramming.net/admin/get-members';
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJpZCI6MSwibmFtZSI6IkFkbWluaXN0cmF0b3IiLCJlbWFpbCI6ImFzaG9rLmFtYXJhQG1vYmlsZXByb2dyYW1taW5nbGxjLmNvbSJ9LCJpYXQiOjE1OTc5MzU1NzcsImV4cCI6MzE5NTg3NDc1NH0.syJvNZoDvbyTXIvKb2UVYScuuHxxXp3AdEfAXkXoHTs',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            response.json().then((result) => {
                console.warn(result.results);
                let size=Math.ceil(result.results.length/15)
                console.log(size)
                this.setState({totalPages:size})
                this.setState({ results: result.results });

            })
        })

    };
    componentDidUpdate() {
    }
    exportPDF = () => {

        if (!this.state.results) return
        const unit = "pt";
        const size = "A4";
        const orientation = "portrait";

        const marginLeft = 30;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(13);

        const title = "Report";
        const headers = [["Member Name", "Email", "Phone Number", "Date Of Birth", "Date Of Joining", "Subscription"]];

        const data = this.state.results.map(elt => [elt.name, elt.email, elt.mobile, elt.dob, elt.create_date, elt.subscription_status]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 30);
        doc.autoTable(content);
        doc.save("report.pdf")
    }
    filter=()=>{

        let list=[];
        list= this.state.results.filter((item, i) => {
                                     
            if ((item.first_name+" "+item.last_name).toLowerCase().startsWith(this.state.search.toLowerCase())) {
                return true;
            }
            else {
                return false;
            }
      
        })
         console.log(list);
         if(this.state.totalPages!==Math.ceil(list.length/15)){
         this.setState({totalPages:Math.ceil(list.length/15)})
         this.setState({page:0});
         }
         return list;
 
       }


    render() {
        const { error, results } = this.state;

        if (error) {
            return (
                <div>Error: {error.message}</div>
            )
        } else {
            return (
                <div>
                    <div className='allMemberHeader'>
                        <h3>All Members List</h3>
                        <div className='allMemberHeaderRightContent'>

                            <input className='searchInput' onChange={(e) => { this.searchMenbers(e.target.value) }} value={this.state.search} placeholder="Search By Name" />


                          


                            <button className="exportButton" onClick={() => { document.getElementById("excelButton").click() }} >Excel</button>


                            <button className="exportButton" onClick={() => { this.exportPDF() }} >PDF</button>


                            <ReactHTMLTableToExcel  
 className="excelhide"  
 id='excelButton'
 table="members"  
filename="Members_Excel"  
sheet="Sheet"  
 buttonText="EXCEL" />

                        </div>
                    </div>
                    <div className='paga'>
                    <ReactPaginate 

                    onPageChange={(page)=>{this.setState({page:page.selected})}}
                
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={<span className="gap">...</span>}
                  
                    pageRangeDisplayed={0}
                    pageCount={this.state.totalPages}
                    pageBound= {2}
                    upperPageBound= {2}
                    marginPagesDisplayed={1}
                    lowerPageBound= {0}
                   
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                    forcePage={this.state.page}
         
         
          disabledClassName={"disabled"}
         
                    />
                    </div>
                    <Table id='members'>
                        <thead>
                            <tr>
                                <th>S.No. </th>
                                <th>Member Name</th>
                                <th>Email </th>
                                <th>Phone Number</th>
                                <th>Date of Birth</th>
                                <th>Date of Joining</th>
                                <th>Subscription</th>
                            </tr>
                        </thead>
                        <tbody className="tableBody">
                            {
                                this.state.results ?
                                   this.filter().map((item, i) =>{

                                    if(i>=(this.state.page)*15 && i<((this.state.page+1)*15))
                                    {
                                       return <tr>
                                            <td>{i + 1}</td>
                                            <td>{item.first_name} {item.last_name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.mobile}</td>
                                            <td>{item.bod}</td>
                                            <td>{item.create_date}</td>
                                            <td>{item.subscription_status == 1 ? 'Subscribed' : 'Not Subscribed' }</td>
                                        </tr>
                                    }
                                     } )
                                    :
                                    null
                            }
                        </tbody>
                    </Table>
                    <div className='paga'>
                    <ReactPaginate 

                    onPageChange={(page)=>{this.setState({page:page.selected})}}
                
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={<span className="gap">...</span>}
                   
                    pageRangeDisplayed={0}
                    pageCount={this.state.totalPages}
                    pageBound= {2}
                    upperPageBound= {2}
                    marginPagesDisplayed={1}
                    lowerPageBound= {0}
                   
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    containerClassName={'pagination'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    activeClassName={'active'}
                    forcePage={this.state.page}
         
         
          disabledClassName={"disabled"}
         
                    />
                    </div>
                </div>
            )
        }
    }
}

export default AllMembersFragment;