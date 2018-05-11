import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as _ from "lodash";
import * as dialogs from "ui/dialogs";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { SwipeGestureEventData } from "ui/gestures";
import { AndroidData, ShapeEnum } from 'nativescript-ng-shadow';
import { Progress } from 'ui/progress';
import { isAndroid, isIOS } from "platform"
import { EventData } from "tns-core-modules/ui/page/page";
import { ItemEventData } from "ui/list-view"
import { ListViewItemSnapMode } from "nativescript-pro-ui/listview";
import { RadListViewComponent } from "nativescript-pro-ui/listview/angular";


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
export class StartupComponent {

  currentBadgesList;
  selectedObjectId;
  stateAnimate = "inactive";
  segmentAnimate: any = "inactive";
  progressValue: number = 0;
  scrollValue;
  tabsItemArray: any;

  buttonShadow: AndroidData = {
    elevation: 8,
    cornerRadius: 40,
  };

  @ViewChild('myRadListView') listViewComponent: RadListViewComponent;

  constructor() {
    this.initializeData();
    this.getBadgesData(4);
    this.progressValue = 0;
  }

  // ngOnInit() {
  //   this.listViewComponent.listView.scrollToIndex(4, false, ListViewItemSnapMode.Center);
  // }

  // ngAfterViewInit() {
  //   this.listViewComponent.listView.scrollToIndex(4, false, ListViewItemSnapMode.Center);
  // }

  onPageLoaded() {
    this.listViewComponent.listView.scrollToIndex(4, false, ListViewItemSnapMode.Center);
  }

  getBadgesData(id) {
    this.selectedObjectId = id;
    this.currentBadgesList = id ? this.tabsItemArray[id].badgesData : this.tabsItemArray[0].badgesData;
  }

  checkTapAccess(obj) {
    return obj.access;
  }

  setActive(id) {
    return _.findIndex(this.tabsItemArray, { active: false });
  }

  onBadgeTap(id) {
    this.currentBadgesList[id].selected = !this.currentBadgesList[id].selected;
  }

  tabItemTap(id, name) {
    if (id > 3 && id < 9) {
      let selectedObject = _.find(this.tabsItemArray, { id: id });

      if (selectedObject <= this.selectedObjectId || selectedObject.completed) {
        selectedObject.access = true;
      }

      if (this.checkTapAccess(selectedObject)) {
        this.scrollValue = this.scrollItem(this.tabsItemArray[id]);
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
  }

  onClickNext() {
    if (this.selectedObjectId < 9) {
      this.tabsItemArray[this.selectedObjectId].completed = true;

      this.selectedObjectId++;

      this.scrollValue = this.scrollItem(this.tabsItemArray[this.selectedObjectId]);
      this.progressValue = this.progressValue + 20;
      this.tabItemTap(this.selectedObjectId, "next");
    }
  }

  checkSelected() {
    return _.find(this.tabsItemArray[this.selectedObjectId].badgesData, { selected: true });
  }

  actionBar() {
    return this.tabsItemArray[this.selectedObjectId].actionbar;
  }


  get getActive() {
    return this.tabsItemArray[this.selectedObjectId].access == true && this.tabsItemArray[this.selectedObjectId].completed != true;
  }

  isDot(item) {
    let centerTabId = this.selectedObjectId > 4 ? this.selectedObjectId : 4
    return item.completed == false && item.id == centerTabId;
  }

  isCurrent(item) {
    let centerTabId = this.selectedObjectId > 4 ? this.selectedObjectId : 4
    return item.id == centerTabId;
  }

  public scrollItem(scrollItem) {
    this.listViewComponent.listView.scrollToIndex(scrollItem.id > 4 ? scrollItem.id : 4, true, ListViewItemSnapMode.Center);
  }

  getIndex(obj) {
    return _.findIndex(this.tabsItemArray, { obj });
  }



  public direction: number;
  onSwipe(args: SwipeGestureEventData) {
    console.log("Swipe!");
    console.log("Object that triggered the event: " + args.object);
    console.log("View that triggered the event: " + args.view);
    console.log("Event name: " + args.eventName);
    console.log("Swipe Direction: " + args.direction);

    this.direction = args.direction;

    switch (this.direction) {
      case 1: {
        let index = this.findCurrentIndex();
        if (index > 3 && index < 9) {
          index--;
          this.listViewComponent.listView.scrollToIndex(index, true, ListViewItemSnapMode.Center);
          this.getBadgesData(index);
        }
        break;
      }
      case 2: {
        let index = this.findCurrentIndex();
        if (index > 3 && index < 9) {
          this.tabsItemArray[index].completed = true;
          index++;
          this.listViewComponent.listView.scrollToIndex(index, true, ListViewItemSnapMode.Center);
          this.getBadgesData(index);
        }
        break;
      }
      default:
        break;
    }
  }


  findCurrentIndex() {
    return _.findIndex(this.tabsItemArray, { id: this.selectedObjectId });
  }

  initializeData() {
    this.tabsItemArray = [
      { id: 0, name: "                     " },
      { id: 1, name: "                     " },
      { id: 2, name: "                     " },
      { id: 3, name: "                     " },
      {
        id: 4, access: true, name: "CURRENT STATE", completed: false, active: true,
        actionbar: "Your current status", badgesData: [
          { compare: "currentStatus", id: 0, title: "Employed", selected: false, },
          { compare: "currentStatus", id: 1, title: "Unmployed", selected: false, },
          { compare: "currentStatus", id: 2, title: "internship", selected: false, },
          { compare: "currentStatus", id: 3, title: "high school", selected: false, },
          { compare: "currentStatus", id: 4, title: "college student", selected: false, }
        ]
      },
      {
        id: 5, access: false, name: "EDUCATION", completed: false, active: false, actionbar: "Your education", badgesData: [
          { compare: "education", id: 0, title: "Graduate", selected: false, },
          { compare: "education", id: 1, title: "Matric", selected: false, },
          { compare: "education", id: 2, title: "Pre Engineering", selected: false, },
        ]
      },
      {
        id: 6, access: false, name: "WORK", completed: false, active: false, actionbar: "Type of working looking for", badgesData: [
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
        id: 7, access: false, name: "LOCATION", completed: false, active: false, actionbar: "Select your city", badgesData: [
          { compare: "location", id: 0, title: "Lahore", selected: false, },
          { compare: "location", id: 1, title: "Karachi", selected: false, },
          { compare: "location", id: 2, title: "Islamabad", selected: false, },
          { compare: "location", id: 3, title: "Peshawar", selected: false, },
          { compare: "location", id: 4, title: "Other", selected: false, }
        ]
      },
      {
        id: 8, access: false, name: "SALARY", completed: false, active: false, actionbar: "Select your expected salary", badgesData: [
          { compare: "salary", id: 0, title: "10000", selected: false, },
          { compare: "salary", id: 1, title: "20000", selected: false, },
          { compare: "salary", id: 2, title: "15000", selected: false, },
          { compare: "salary", id: 3, title: "40000", selected: false, },
        ]
      },
      { id: 9, name: "                     " },
      { id: 10, name: "                     " },
    ]
  }

}