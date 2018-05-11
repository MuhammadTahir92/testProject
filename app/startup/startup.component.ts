import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import * as dialogs from "ui/dialogs";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { AndroidData, ShapeEnum } from 'nativescript-ng-shadow';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css'],
  moduleId: module.id,
  animations: [
    trigger("state", [
      state("inactive", style({
        opacity: 1,
        transform: "scale(1)",
      })),
      state("active", style({
        opacity: 0,
        transform: "scale(0)",
      })),
      state("segmentOpacity", style({
        opacity: 0.6,
      })),
      transition("inactive <=> active", [animate("300ms ease-out")]),
      transition("inactive <=> segmentOpacity", [animate("300ms ease-out")]),
    ]),
  ]
})
export class StartupComponent implements OnInit {
  currentBadgesList;
  selectedObjectId;
  stateAnimate = "inactive";
  segmentAnimate: any = "inactive";
  progressValue: number = 0;
  constructor() {
    this.getBadgesData(0);
    this.progressValue = 0;
  }

  ngOnInit(): void {
  }

  tabsItemArray = [
    {
      id: 0, access: true, name: "CURRENT STATE", completed: false, active: true,
      actionbar: "Your current status", badgesData: [
        { compare: "currentStatus", id: 0, title: "Employed", selected: false, },
        { compare: "currentStatus", id: 1, title: "Unmployed", selected: false, },
        { compare: "currentStatus", id: 2, title: "internship", selected: false, },
        { compare: "currentStatus", id: 3, title: "high school", selected: false, },
        { compare: "currentStatus", id: 4, title: "college student", selected: false, }
      ]
    },
    {
      id: 1, access: false, name: "EDUCATION", completed: false, active: false, actionbar: "Your education", badgesData: [
        { compare: "education", id: 0, title: "Graduate", selected: false, },
        { compare: "education", id: 1, title: "Matric", selected: false, },
        { compare: "education", id: 2, title: "Pre Engineering", selected: false, },
      ]
    },
    {
      id: 2, access: false, name: "WORK", completed: false, active: false, actionbar: "Type of working looking for", badgesData: [
        { compare: "work", id: 0, title: "Full time", selected: false, },
        { compare: "work", id: 1, title: "part time", selected: false, },
        { compare: "work", id: 2, title: "extra income", selected: false, },
        { compare: "work", id: 3, title: "summer job", selected: false, },
        { compare: "work", id: 4, title: "from home", selected: false, },
        { compare: "work", id: 5, title: "internship", selected: false, },
        { compare: "work", id: 6, title: "seasonal", selected: false, }
      ]
    },
    {
      id: 3, access: false, name: "LOCATION", completed: false, active: false, actionbar: "Select your city", badgesData: [
        { compare: "location", id: 0, title: "Lahore", selected: false, },
        { compare: "location", id: 1, title: "Karachi", selected: false, },
        { compare: "location", id: 2, title: "Islamabad", selected: false, },
        { compare: "location", id: 3, title: "Peshawar", selected: false, },
        { compare: "location", id: 4, title: "Other", selected: false, }
      ]
    },
    {
      id: 4, access: false, name: "SALARY", completed: false, active: false, actionbar: "Select your expected salary", badgesData: [
        { compare: "salary", id: 0, title: "10000", selected: false, },
        { compare: "salary", id: 1, title: "20000", selected: false, },
        { compare: "salary", id: 2, title: "15000", selected: false, },
        { compare: "salary", id: 3, title: "40000", selected: false, },
      ]
    }
  ]


  getBadgesData(id) {
    console.log("this is the id now --------" + id);
    this.selectedObjectId = id;
    if (id) {
      this.currentBadgesList = this.tabsItemArray[id].badgesData;
    }
    else {
      this.currentBadgesList = this.tabsItemArray[0].badgesData;
    }
  }

  tabItemTap(id, name) {

    let selectedObject = _.find(this.tabsItemArray, function (o) {
      return o.id == id;
    });
    if (name == "next") {
      selectedObject.access = true;
    }

    if (this.checkTapAccess(selectedObject)) {
      this.setActive(id);
      selectedObject.active = true;
      this.stateAnimate = "active";
      this.segmentAnimate = "segmentOpacity";
      setTimeout(() => {
        this.getBadgesData(id);
        setTimeout(() => {
          this.stateAnimate = "inactive";
          this.segmentAnimate = "inactive";
        }, 200);
      }, 200);
    }
  }


  checkTapAccess(obj) {
    if (obj.access == true) {
      return true;
    }
    else {
      dialogs.alert("Please select one item ").then(() => {
        console.log("Dialog closed!");
      });
      return false;
    }
  }

  setActive(id) {
    return _.findIndex(this.tabsItemArray, function (o) {
      return o.active = false;
    });
  }

  onBadgeTap(id) {
    this.currentBadgesList[id].selected = !this.currentBadgesList[id].selected;
  }


  onClickNext() {
    let obj = this.checkSelected();
    if (obj) {
      this.tabsItemArray[this.selectedObjectId].completed = true;
      this.progressValue = this.progressValue + 20;
      this.tabItemTap(this.selectedObjectId + 1, "next");
    }
    else {
      dialogs.alert("Please select one item ").then(() => {
        console.log("Dialog closed!");
      });
    }
  }

  checkSelected() {
    return _.find(this.tabsItemArray[this.selectedObjectId].badgesData, function (o) {
      if (o.selected == true) {
        return true;
      }
    });
  }

  actionBar() {
    return this.tabsItemArray[this.selectedObjectId].actionbar;
  }


  get getActive() {
    if (this.tabsItemArray[this.selectedObjectId].access == true && this.tabsItemArray[this.selectedObjectId].completed != true) {
      return true;
    }
  }

  getDot(item) {
    if (item.completed == false && item.active == true) {
      return true;
    }
  }

  buttonShadow: AndroidData = {
    elevation: 8,
    cornerRadius: 40,
    // bgcolor: '#ff1744',
    // shape: ShapeEnum.OVAL,
  };
}